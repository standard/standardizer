import { createServer } from './server.js'

const server = createServer()

server.listen(process.env.PORT || 8080, function () {
  console.log('%s listening at %s', server.name, server.url)
})
