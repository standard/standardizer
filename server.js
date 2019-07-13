var fs = require('fs')
var Remarkable = require('remarkable')
var path = require('path')
var restify = require('restify')
var standard = require('standard')
var restifyErrors = require('restify-errors')

const corsMiddleware = require('restify-cors-middleware')

const cors = corsMiddleware({
  origins: ['*']
})

var stdPkg = require('standard/package.json')
var versions = {
  standardizer: require('./package.json').version,
  standard: stdPkg.version
}

Object.keys(stdPkg.dependencies).forEach(function (dep) {
  versions[dep] = require(`${dep}/package.json`).version
})

var md = new Remarkable({ html: true })

var indexPath = path.join(__dirname, 'index.md')
var index = md.render(fs.readFileSync(indexPath, 'utf8'), { sanitize: false })

module.exports = createServer

function createServer () {
  var server = restify.createServer()
  server.name = 'standardizer'
  server.use(restify.plugins.bodyParser({ mapParams: true }))
  server.pre(cors.preflight)
  server.use(cors.actual)

  server.pre(restify.pre.userAgentConnection())
  server.get('/version', version)
  server.post('/lint', lint)
  server.post('/fix', fix)
  server.get('/', sendIndex)

  return server
}

function version (req, res, next) {
  res.send(versions)
  next()
}

function lint (req, res, next) {
  if (!req.body || !req.body.text) {
    return next(new restifyErrors.BadRequestError('text field is required.'))
  }

  standard.lintText(req.body.text, (err, result) => {
    if (err) return next(err)

    res.send(result)
    next()
  })
}

function fix (req, res, next) {
  if (!req.body || !req.body.text) {
    return next(new restifyErrors.BadRequestError('text field is required.'))
  }

  standard.lintText(req.body.text, { fix: true }, (err, result) => {
    if (err) return next(err)

    res.send(result)
    next()
  })
}

function sendIndex (req, res, next) {
  res.setHeader('Content-Type', 'text/html')
  res.writeHead(200)
  res.end(index)
  next()
}
