# External dependencies
{get, ready} = require('derby').createApp module


# Routes
# ------

get '/', (page, model, params, next) ->
  return page.redirect '/' if page.params?.query?.play?
  model.subscribe 'message', ->
    page.render()


# Controller functions
# --------------------

ready (model) ->
  # TODO