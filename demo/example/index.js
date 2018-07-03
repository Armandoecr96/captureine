const handler = require('serve-handler')
const http = require('http')

const server = http.createServer(handler)

server.listen(4000, () => {
  console.log('Running at http://localhost:4000')
})
