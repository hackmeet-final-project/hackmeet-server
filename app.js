const cors = require('cors')
const express = require('express')
const router = require('./routers/index')
const app = express()
const server = require('http').Server(app)

const io = require('socket.io')(server, {
    allowEIO3: true,
    cors: {
        origin: ['http://localhost:5173']
    }
})

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use(router)

const PORT = process.argv.PORT || 3000
