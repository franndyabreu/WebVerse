'use strict'

const Sequelize = require('sequelize')
const setupDB = require('../lib/db')

module.exports = function setupMetricModel (config) {
  const sequelize = setupDB(config)

  return sequelize.define('metric', {
    type: {
      type: Sequelize.STRING,
      allowNull: false
    },

    value: {
      type: Sequelize.TEXT,
      allowNull: false
    }
  })
}
