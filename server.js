const fs = require('fs')
const path = require('path')
const restify = require('restify')
const standard = require('standard')
const restifyErrors = require('restify-errors')

const corsMiddleware = require('restify-cors-middleware')

const cors = corsMiddleware({
  origins: ['*'],
  allowHeaders: ['user-agent']
})

const stdPkg = require('standard/package.json')
const versions = {
  standardizer: require('./package.json').version,
  standard: stdPkg.version
}

Object.keys(stdPkg.dependencies).forEach(function (dep) {
  versions[dep] = require(`${dep}/package.json`).version
})

const indexPath = path.join(__dirname, 'index.html')
const index = fs.readFileSync(indexPath, 'utf8')

module.exports = createServer

function createServer () {
  const server = restify.createServer()
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
