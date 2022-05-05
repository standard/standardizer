import { readFileSync } from 'fs'

import restify from 'restify'
import standard from 'standard'
import restifyErrors from 'restify-errors'

import corsMiddleware from 'restify-cors-middleware2'

const cors = corsMiddleware({
  origins: ['*'],
  allowHeaders: ['user-agent']
})

const stdPkg = JSON.parse(readFileSync('./node_modules/standard/package.json'))

const pkg = JSON.parse(readFileSync('./package.json'))

const versions = {
  standardizer: pkg.version,
  standard: stdPkg.version
}

for (const dep of Object.keys(stdPkg.dependencies)) {
  const depPkg = JSON.parse(readFileSync(`./node_modules/${dep}/package.json`))

  versions[dep] = depPkg.version
}
const index = await readFileSync('./index.html')

export function createServer () {
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

async function lint (req, res, next) {
  if (!req.body || !req.body.text) {
    return next(new restifyErrors.BadRequestError('text field is required.'))
  }

  try {
    const result = await standard.lintText(req.body.text)
    res.send(result)
    next()
  } catch (err) {
    return next(err)
  }
}

async function fix (req, res, next) {
  if (!req.body || !req.body.text) {
    return next(new restifyErrors.BadRequestError('text field is required.'))
  }

  try {
    const result = await standard.lintText(req.body.text, { fix: true })
    res.send(result)
    next()
  } catch (err) {
    return next(err)
  }
}

function sendIndex (req, res, next) {
  res.setHeader('Content-Type', 'text/html')
  res.writeHead(200)
  res.end(index)
  next()
}
