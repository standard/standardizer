var fs = require('fs')
var marky = require('marky-markdown')
var path = require('path')
var restify = require('restify')
var standard = require('standard')
var standardFormat = require('standard-format')

var standardVersion = require('./node_modules/standard/package.json').version
var standardFormatVersion = require('./node_modules/standard-format/package.json').version
var standardizerVersion = require('./package.json').version

module.exports = createServer

function createServer () {
  var server = restify.createServer()
  server.name = 'standardizer'
  server.use(restify.bodyParser())
  server.use(restify.CORS())

  server.pre(restify.pre.userAgentConnection())
  server.get('/version', version)
  server.post('/lint', lint)
  server.post('/format', format)
  server.post('/post', format)
  server.get('/', sendIndex)

  return server
}

function version (req, res, next) {
  res.send({
    'version': standardizerVersion,
    'standard': standardVersion,
    'standard-format': standardFormatVersion
  })
  next()
}

function lint (req, res, next) {
  if (!req.body || !req.body.text) {
    return next(new restify.errors.BadRequestError('text field is required.'))
  }

  standard.lintText(req.body.text, (err, result) => {
    if (err) return next(err)

    res.send(result)
    next()
  })
}

function format (req, res, next) {
  if (!req.body || !req.body.text) {
    return next(new restify.errors.BadRequestError('text field is required.'))
  }

  var result = {text: standardFormat.transform(req.body.text)}
  res.send(result)
  next()
}

function sendIndex (req, res, next) {
  fs.readFile(path.join(__dirname, 'index.md'), 'utf8', function (err, data) {
    if (err) return next(err)
    res.setHeader('Content-Type', 'text/html')
    res.writeHead(200)
    res.end(marky(data, {sanitize: false}).html())
    next()
  })
}
