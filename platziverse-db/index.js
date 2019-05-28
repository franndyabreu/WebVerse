/* A Simple IoT Platform - DB Module */
"use strict";

const setupDB = require("./lib/db");
const setupMetricModel = require("./models/metric");
const setupAgentModel = require("./models/agent");

module.exports = async function(config) {
  const sequelize = setupDB(config);
  const AgentModel = setupAgentModel(config);
  const MetricModel = setupMetricModel(config);

  AgentModel.hasMany(MetricModel);
  MetricModel.belongsTo(AgentModel);

  await sequelize.authenticate();

  /* CAUTION : The property force if set to true will overwrite 
          the database if it already exists. */
  if (config.setup) {
    await sequelize.sync({ force: true });
  }
  const Agent = {};
  const Metric = {};

  return {
    Agent,
    Metric
  };
};
