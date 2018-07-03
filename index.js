const app = require('express')()
const http = require('http').Server(app)
const io = require('socket.io')(http)

const data = require('./dataIne')

const sesions = []

io.on('connection', handleConnectedSocket)

function handleConnectedSocket (socket) {
  console.log('User connected ', socket.id)

  socket.on('getCaptcha', (cb) => {
    data.initPuppeteer({ headless: false })
    .then(({ page, imageCaptcha }) => {
      sesions.push({ user: socket.id, page })
      cb(imageCaptcha)
    })
  })

  socket.on('validateINE', ({ ine, nu, ocr, captcha }, cb) => {
    const userSession = sesions.find(x => x.user === socket.id)
    data.modelABC(userSession.page, ine, nu, ocr, captcha).then(cb)
  })

  /*
  socket.on('resolveCapcha', async (ine, capcha, cb) => {
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
  console.log('Running at http://localhost:3000')
))
