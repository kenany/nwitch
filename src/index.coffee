irc = require 'irc'
{serverAddress, logger} = require './common'
{bot} = require './config'

# Connect to the IRC server
logger.info 'Connecting to IRC...'
client = new irc.Client serverAddress, bot.username,
  userName: bot.username
  password: bot.password
  channels: bot.channel

# ## Listeners

# Error listener
logger.info 'First setting up error listener...'
client.addListener 'error', (message) ->
  logger.error message