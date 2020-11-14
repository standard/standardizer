const portfinder = require('portfinder')

const clients = require('restify-clients')

const createServer = require('../server.js')
const test = require('tape')

const server = createServer()
let client

test('setup server and client', function (t) {
  portfinder.getPort((err, port) => {
    t.error(err)
    server.listen(port, '0.0.0.0', function () {
      client = clients.createJsonClient({
        url: server.url
      })
      t.ok(server.url, 'server started')
      t.end()
    })
  })
})

test('get version info', (t) => {
  client.get('/version', (err, req, res, obj) => {
    t.error(err)

    t.ok(obj.standardizer, 'standardizer version returned')
    t.ok(obj.standard, 'standard version returned')

    t.end()
  })
})

test('lint some text', (t) => {
  client.post('/lint', { text: "console.log('woot');\n" }, (err, req, res, obj) => {
    t.error(err, 'no error')
    t.equals(obj.errorCount, 1, 'successfully linted')
    t.equals(obj.results[0].messages[0].message, 'Extra semicolon.', 'correct lint message')
    t.end()
  })
})

test('lint some text - null body', (t) => {
  client.post('/lint', null, (err, req, res, obj) => {
    t.ok(err, 'error returned')
    t.equals(obj.message, 'text field is required.', 'correctly returns error')
    t.equals(res.statusCode, 400, '400 statusCode returned')
    t.end()
  })
})

test('lint some text - no text field in body', (t) => {
  client.post('/lint', { data: 'console.log("wut")' }, (err, req, res, obj) => {
    t.ok(err, 'error returned')
    t.equals(obj.message, 'text field is required.', 'correctly returns error')
    t.equals(res.statusCode, 400, '400 statusCode returned')
    t.end()
  })
})

test.onFinish(() => {
  client.close()
  server.close()
})
