var createServer = require('./server.js')

var server = createServer()

server.listen(process.env.PORT || 8080, function () {
  console.log('%s listening at %s', server.name, server.url)
})
