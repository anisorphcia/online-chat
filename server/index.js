const express = require('express')
const cors = require('cors')
const { Server } = require('socket.io')
const http = require('http')

const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost:27017/chat-app', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

mongoose.connection.on('connected', () => {
  console.log('MongoDB connected')
})

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err)
})

const app = express()
const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: '*',
  },
})

app.use(cors())
app.use(express.json())

require('./socket')(io)

const PORT = 3000
server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
})