module.exports.view = (req, res, next) ->
  model = req.getModel()
  _view = model.get('_view') or {}
  _view.mobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(req.header 'User-Agent')
  _view.nodeEnv = process.env.NODE_ENV
  model.set '_view', _view
  next()