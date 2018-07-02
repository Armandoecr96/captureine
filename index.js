const app = require('express')()
const http = require('http').Server(app)
const io = require('socket.io')(http)

const data = require('./dataIne')

const sesions = []

io.on('connection', handleConnectedSocket)

async function handleConnectedSocket (socket) {
  const page = data.initPuppeteer()
  sesions.push({ user: socket.id, page })

  socket.on('getCaptcha', (ine, nu, ocr, captcha, cb) => {
    const userSession = sesions.find(x => x.user === socket.id)
    data.modelABC(userSession.page, ine, nu, ocr, captcha)
    console.log('hasCallback: ', cb(ine))
  })

  /**
  socket.on('resolveCapcha', (ine, capcha, cb) => {
    data.modelABC(ine, capcha)
    console.log('hasCallback: ', cb(capcha))
  })
   */

  socket.on('disconnect', () => {
    var index = sesions.indexOf(5)
    if (index > -1) sesions.splice(index, 1)
    console.log('user disconnected')
  })
}

http.listen(process.env.PORT || 3000, () => (
  console.log('Server enabled')
))
