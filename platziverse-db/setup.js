"use strict";

const db = require("./");
const debug = require("debug")("Platzi-Verse:db:setup");
const inquirer = require("inquirer");
const chalk = require("chalk");
const prompt = inquirer.createPromptModule();
const minimist = require("minimist");
const args = minimist(process.argv);
const config = require("./db_config")();

async function setup() {
  if (!args.yes) {
    const answer = await prompt([
      {
        type: "confirm",
        name: "setup",
        message: "This will destroy your database, are you sure?"
      }
    ]);

    if (!answer.setup) {
      return console.log("Nothing happened :)");
    }
  }

  await db(config).catch(handleFatalError);

  console.log("Success!");
  process.exit(0);
}

function handleFatalError(err) {
  console.log(`${chalk.red(`[FATAL ERROR]: ${err}`)}`);
  console.log(err.stack);
  process.exit(1);
}

setup();
