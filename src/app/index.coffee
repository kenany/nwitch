# External dependencies
{get, ready} = require('derby').createApp module


# Routes

get '/', (page, model, params, next) ->
  return page.redirect '/' if page.params?.query?.play?
  model.subscribe 'message', ->
    page.render()


# Controller functions

ready (model) ->

  # Tell Firefox to use elements for styles instead of CSS
  # see: https://developer.mozilla.org/en/Rich-Text_Editing_in_Mozilla
  document.execCommand 'useCSS', false, true
  document.execCommand 'styleWithCSS', false, false