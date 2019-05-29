"use strict";

const test = require("ava");
const proxyquire = require("proxyquire");
const sinon = require("sinon");
let db = null;
let sandbox = null; //Resets the number of time a particular funciton have been called.

let config = {
  logging: function() {}
};

let MetricStub = {
  belongsTo: sinon.spy()
};

let AgentStub = null;

test.beforeEach(async () => {
  sandbox = sinon.createSandbox();
  AgentStub = {
    hasMany: sinon.spy()
  };

  const setupDB = proxyquire("../", {
    "./models/agent": () => AgentStub,
    "./models/metric": () => MetricStub
  });
  db = await setupDB(config);
});

test.afterEach(() => {
  sinon.restore();
});

test("Agent", t => {
  t.truthy(db.Agent, "Agent service should exist");
});

test.serial("Setup", t => {
  t.true(AgentStub.hasMany.called, "AgentMode.hasMany was executed");
  t.true(MetricStub.belongsTo.called, "MetricStub.belongsTo was executed");
});
