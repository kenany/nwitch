#!/usr/bin/env node

var path = require('path');
var fs = require('graceful-fs');
var inquirer = require('inquirer');
var json2toml = require('json2toml');

var logger = require('../lib/core/logger');

var QUESTIONS = [
  {
    type: 'input',
    name: 'account.username',
    message: 'What is the bot\'s username?',
    filter: String
  },
  {
    type: 'input',
    name: 'account.password',
    message: 'What is the bot\'s password?',
    filter: String
  },
  {
    type: 'input',
    name: 'account.channel',
    message: 'What channel should the bot join?',
    filter: String
  },
  {
    type: 'input',
    name: 'irc.address',
    message: 'What is the address of Twitch\'s IRC server?',
    default: '199.9.250.239',
    filter: String
  },
  {
    type: 'input',
    name: 'irc.port',
    message: 'What is the port of Twitch\'s IRC server?',
    default: 6667,
    filter: Number
  },
  {
    type: 'input',
    name: 'server.port',
    message: 'What port would you like to use for your dashboard?',
    default: 3001,
    filter: Number
  },
  {
    type: 'input',
    name: 'server.cacheAge',
    message: 'How long should we cache assets for?',
    default: '1 year',
    filter: String
  },
];

inquirer.prompt(QUESTIONS, function(answers) {

  // The output of the json2toml module isn't the prettiest TOML around. The
  // primary issue is that there are no newlines between the key groups.
  //
  // To work around this, we can json2toml-ify the key groups one at a time, and
  // add a newline after each ourselves.
  var configs = [
    {
      account: {
        username: answers['account.username'],
        password: answers['account.password'],
        channel: answers['account.channel']
      }
    },
    {
      irc: {
        address: answers['irc.address'],
        port: answers['irc.port']
      }
    },
    {
      server: {
        port: answers['server.port'],
        cacheAge: answers['server.cacheAge']
      }
    },
  ];

  var tomlFile = '';
  configs.forEach(function(conf) {
    tomlFile += json2toml(conf) + '\n';
  });

  fs.writeFileSync(path.resolve(process.cwd(), './config.toml'), tomlFile);
  logger.info('Config file created!');
});