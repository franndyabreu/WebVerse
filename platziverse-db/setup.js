'use strict'

const db = require('./')
const debug = require('debug')('Platzi-Verse:db:setup')
const inquirer = require('inquirer')
const chalk = require('chalk')
const prompt = inquirer.createPromptModule()

async function setup () {
  const answer = await prompt([
    {
      type: 'confirm',
      name: 'setup',
      message: 'By saying YES the database will be DELETED, are you sure?'
    }
  ])

  if (!answer.setup) {
    console.log('Nothing happened!')
    return
  }
  const config = {
    database: process.env.DB_NAME || 'platziverse',
    username: process.env.DB_USERNAME || 'franndy',
    password: process.env.DB_PASSWORD || 'franndy',
    host: process.env.DB_HOST || 'localhost',
    dialect: 'postgres',
    logging: s => debug(s),
    setup: true
  }

  function handleFatalError (err) {
    console.log(`${chalk.red(`[FATAL ERROR]: ${err}`)}`)
    console.log(err.stack)
    process.exit(1)
  }
  await db(config).catch(handleFatalError)
  console.log('Database Created')
  process.exit(1)
}

setup()
