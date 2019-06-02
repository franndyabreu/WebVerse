"use-strict";

const db = require("../");
const chalk = require("chalk");

function handleFatalError(err) {
  console.log(`${chalk.red(`[FATAL ERROR]: ${err}`)}`);
  console.log(err.stack);
  process.exit(1);
}

async function run() {
  const config = {
    database: process.env.DB_NAME || "platziverse",
    username: process.env.DB_USERNAME || "franndyabreu",
    password: process.env.DB_PASSWORD || "franndy",
    host: process.env.DB_HOST || "localhost",
    dialect: "postgres"
  };

  const { Agent, Metric } = await db(config).catch(handleFatalError);

  const agent = await Agent.createOrUpdate({
    uuid: "yyy",
    name: "test",
    username: "test",
    hostname: "test",
    pid: 1,
    connected: true
  }).catch(handleFatalError);

  const agent1 = await Agent.createOrUpdate({
    uuid: "xxx",
    name: "test2",
    username: "test2",
    hostname: "test2",
    pid: 2,
    connected: true
  }).catch(handleFatalError);

  console.log("--- AGENT ---");
  console.log(agent);

  const agents = await Agent.findAll();
  console.log("--- AGENT FIND ALL METHOD ---");
  console.log(agents);

  const findAgent = await Agent.findByUuid("xxx").catch(handleFatalError);
  console.log("Find by UUID Method");
  console.log(findAgent);

  const metric2 = await Metric.create(agent1.uuid, {
    type: "cpu",
    value: "1000"
  }).catch(handleFatalError);
  console.log("FIND MY AGENT UUID METRIC");
  const metric1 = await Metric.findByAgentUuid(agent1.uuid);
  console.log(metric1);

  const metrics = await Metric.findByTypeAgentUuid("cpu", agent1.uuid).catch(
    handleFatalError
  );
  console.log("---- METRICS ----");
  console.log(metrics);
}

run();
