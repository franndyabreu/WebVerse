const debug = require("debug")("platziverse:db:setup");

module.exports = function(init = true) {
  const config = {
    database: process.env.DB_NAME || "platziversedb",
    username: process.env.DB_USERNAME || "franndyabreu",
    password: process.env.DB_PASSWORD || "postgres",
    host: process.env.DB_HOST || "localhost",
    dialect: "postgres",
    logging: s => debug(s),
    setup: init
  };
  return config;
};
