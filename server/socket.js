const Message = require('./models/Message')

module.exports = function (io) {
  io.on('connection', async (socket) => {
    const messages = await Message.find().sort({ createdAt: 1 }).limit(50)
    // 广播消息
    messages.forEach((msg) => {
      socket.emit('chat message', {
        text: msg.text,
        userId: msg.userId,
        createdAt: msg.createdAt,
      })
    })

    socket.on('chat message', async (msg) => {
      // 保存到数据库
      await Message.create({
        text: msg.text,
        userId: msg.userId,
      })

      // 广播消息
      io.emit('chat message', {
        text: msg.text,
        userId: msg.userId,
        createdAt: new Date(),
      })
    })

    // 监听用户连接
    socket.on('disconnect', () => {
      console.log('user disconnected', socket.id)
    })
  })
}