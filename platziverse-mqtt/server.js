"use strict";

const debug = require("debug")("platziverse:mqtt");
const mosca = require("mosca");
const redis = require("redis");
const chalk = require("chalk");
const db = require("platziverse-db");
const config = require("../platziverse-db/db_config")(false);
const { parsePayload } = require("./utils");

const backend = {
  type: "redis",
  redis,
  return_buffers: true
};

const settings = {
  port: 1883,
  backend
};

const server = new mosca.Server(settings);
const clients = new Map();

let Agent,
  Metric = null;

server.on("clientConnected", async client => {
  clients.set(client.id, null);
  debug(`Client Connected: ${client.id}`);
});

server.on("clientDisconnected", async client => {
  debug(`Client disconnected: ${client.id}`);
  const agent = clients.get(client.id);

  if (agent) {
    //Desconnet agent
    agent.connected = false;
    try {
      await Agent.createOrUpdate(agent);
    } catch (err) {
      return handleError(err);
    }
    //Delete agent from clients list
    clients.delete(client.id);

    server.publish({
      topic: "agent/disconnected",
      payload: JSON.stringify({
        agent: {
          uuid: agent.uuid
        }
      })
    });

    debug(
      `Client ${client.id} associated to Agent ${
        agent.uuid
      } marked as disconnected`
    );
  }
});

server.on("published", async (packet, client) => {
  switch (packet.topic) {
    case "agent/connected":
    case "agent/disconnected":
      debug(`Payload: ${packet.payload}`);
      break;
    case "agent/message":
      debug(`Payload: ${packet.payload}`);
      const payload = parsePayload(packet.payload);
      console.log(typeof payload.metrics);

      if (payload) {
        payload.agent.connected = true;

        let agent;
        try {
          agent = await Agent.createOrUpdate(payload.agent);
        } catch (err) {
          return handleError(err);
        }
        debug(`Agent: ${agent.uuid} saved`);
        //Notify agent is connected.
        notifyConnectedAgent(client, agent);
        //Store the metrics
        storeMetrics(agent, payload);
      }
      break;
  }
});
server.on("ready", async () => {
  const services = await db(config).catch(handleFatalError);
  Agent = services.Agent;
  Metric = services.Metric;

  console.log(
    `${chalk.green("[PLATZIVERSE - MQTT] Server is running on port: ")} ${
      settings.port
    }`
  );
});

server.on("error", handleFatalError);

async function storeMetrics({ uuid }, { metrics }) {
  Promise.all(
    metrics.map(async metric => {
      await Metric.create(uuid, metric)
        .then(metric => debug(`Metric ${metric.id} saved on agent ${uuid}`))
        .catch(handleError);
    })
  );
  return;
}

function notifyConnectedAgent(client, agent) {
  if (!clients.get(client.id)) {
    clients.set(client.id, agent);
    server.publish({
      topic: "agent/connected",
      payload: JSON.stringify({
        agent: {
          uuid: agent.uuid,
          name: agent.name,
          hostname: agent.hostname,
          pid: agent.pid,
          connected: agent.connected
        }
      })
    });
  }
}

function handleFatalError(err) {
  console.log(`${chalk.red("[FATAL ERROR]")} ${err.message}`);
  console.log(err.stack);
  process.exit(1);
}

function handleError(err) {
  console.log(`${chalk.red("[ERROR]")} ${err.message}`);
  console.log(err.stack);
}

process.on("uncaughtException", handleFatalError);
process.on("unhandledRejection", handleFatalError);
