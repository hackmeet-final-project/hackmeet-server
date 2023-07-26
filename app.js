const cors = require('cors')
const express = require('express')
const router = require('./routers/index')
const errorHandler = require('./middlewares/errorHandler')
const app = express()
const server = require('http').Server(app)
const PORT = process.argv.PORT || 3000

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))


app.use(router)
app.use(errorHandler)

const io = require('socket.io')(server, {
    cors: {
        origin: ['http://localhost:5173']
    }
})

const rooms = []
let totalUserOnRoom = 0

io.on("connection", (socket) => {
    socket.on("join-room", (username, peerId) => {
        if(rooms.length === 0) {
            rooms.push(username)
            socket.join(rooms[0])
        } else {
            socket.join(rooms[0])
        }
        socket.nsp.to(rooms[0]).emit("assign-room", rooms[0], peerId)
        
        totalUserOnRoom++
        if(totalUserOnRoom === 2) {
            totalUserOnRoom = 0
            rooms.pop()
        }
    })

})

server.listen(PORT, () => {
    console.log(`listening on ${PORT}`)
})

module.exports = app

