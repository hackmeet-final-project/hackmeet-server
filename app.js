const cors = require('cors')
const express = require('express')
const redis = require('./config/redis')
const router = require('./routers/index')
const errorHandler = require('./middlewares/errorHandler')
const { Room } = require('./models')
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

io.on("connection", (socket) => {
    console.log(`user login`, socket.id)
    socket.on("join-room", async(username, peerId) => {
        try {
            let room = await Room.findOne({
                where: {
                    totalUser: 1
                }
            })
            if(!room) {
                room = await Room.create({
                    name: peerId,
                    owner: peerId,
                })
                socket.join(room.dataValues.name)
            } else {
                await room.update(
                {
                    guest: peerId,
                    totalUser: 2
                })
                socket.join(room.dataValues.name)
            }
            console.log(`user ${username} join ke room`, room.dataValues.name)
     
            socket.nsp.to(room.dataValues.name).emit("assign-room", room.dataValues.name)
    
            if(peerId !== room.dataValues.name) {
                socket.nsp.to(room.dataValues.name).emit("call-user", room.dataValues.name)
            }
        } catch (error) {
            console.log(error)
        }
    })

    socket.on("start-timer", room => {
        console.log(`timer jalan di room`, room)
        socket.nsp.to(room).emit("timer-ready")
    })

    socket.on("send-message", (message, room) => {
        socket.to(room).emit("receive-message", message)
    })
})

// server.listen(PORT, () => {
//     console.log(`listening on ${PORT}`)
// })

module.exports = server