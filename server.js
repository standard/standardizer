var fs = require('fs')
var marky = require('marky-markdown')
var path = require('path')
var restify = require('restify')
var standard = require('standard')
var standardFormat = require('standard-format')

var stdPkg = require('standard/package.json')
var versions = {
  'standardizer': require('./package.json').version,
  'standard-format': require('standard-format/package.json').version,
  'standard': stdPkg.version
}

Object.keys(stdPkg.dependencies).forEach(function (dep) {
  versions[dep] = require(`${dep}/package.json`).version
})

var indexPath = path.join(__dirname, 'index.md')
var index = marky(fs.readFileSync(indexPath, 'utf8'), {sanitize: false}).html()

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
  res.send(versions)
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
  res.setHeader('Content-Type', 'text/html')
  res.writeHead(200)
  res.end(index)
  next()
}
