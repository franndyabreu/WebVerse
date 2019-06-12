"use strict";

const debug = require("debug")("platziverse:agent");
const mqtt = require("mqtt");
const defaults = require("defaults");
const { parsePayload } = require("../platziverse-utils/utils");
const uuid = require("uuid");

const options = {
  name: "untitled",
  username: "platzi",
  interval: 5000,
  mqtt: {
    host: "mqtt://localhost"
  }
};
const EventEmitter = require("events");

class PlatziverseAgent extends EventEmitter {
  constructor(opts) {
    super();
    this._options = defaults(opts, options);
    this._started = false;
    this._timer = null;
    this._client = null;
    this._agentId = null;
  }

  connect() {
    if (!this._timer) {
      const opts = this._options;
      this._client = mqtt.connect(opts.mqtt.host);
      this._started = true;

      this._client.subscribe("agent/message");
      this._client.subscribe("agent/connected");
      this._client.subscribe("agent/disconnected");

      this._client.on("connect", () => {
        this._agentId = uuid.v4();

        this.emit("connected", this._agentId);

        this._timer = setInterval(() => {
          this.emit("agent/message", "this is a message");
        }, opts.interval);
      });
      this._client.on("message", (topic, payload) => {
        payload = parsePayload(payload);

        let broadcast = false;

        switch (topic) {
          case "agent/message":
          case "agent/connected":
          case "agent/disconnected":
            broadcast =
              payload && payload.agent && payload.agent.uuid !== this._agentId;
            break;
          default:
            broadcast = false;
            break;
        }
        if (broadcast) {
          this.emit(topic, payload);
        }
      });
      this._client.on("error", () => this.disconnect());
    }
  }

  disconnect() {
    if (this._started) {
      clearInterval(this._timer);
      this._started = false;
      this.emit("disconnected");
    }
  }
}

module.exports = PlatziverseAgent;
