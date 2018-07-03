const socket = io('http://localhost:3000')

socket.emit('getCaptcha', '81374982741', 'eiu828j', '34', 'fbd21', (response) => {
  console.log('Server: ', response)
})
