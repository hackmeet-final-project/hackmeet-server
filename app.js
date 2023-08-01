const cors = require('cors')
const express = require('express')
const router = require('./routers/index')
const errorHandler = require('./middlewares/errorHandler')
const { Room } = require('./models')
const { Op } = require('sequelize')
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
  // console.log(`user login`, socket.id)
  socket.on("join-room", async (username, peerId) => {
    try {
      let room = await Room.findOne({
        where: {
          totalUser: 1
        }
      })
      if (!room) {
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
      // console.log("USER", username, "masuk ke room", room.dataValues)

      socket.nsp.to(room.dataValues.name).emit("assign-room", room.dataValues.name)

      if (peerId !== room.dataValues.name) {
        socket.nsp.to(room.dataValues.name).emit("call-user", room.dataValues.name)
      }
    } catch (error) {
      console.log(error)
    }
  })
  socket.on("players-ready", async (peerId) => {
    const room = await Room.findOne({
      where: {
        [Op.or]: [
          {
            owner: peerId
          },
          {
            guest: peerId
          }
        ]
      }
    })
    socket.nsp.to(room.dataValues.name).emit("set-ready")
  })

  socket.on("send-message", (message, room) => {
    socket.to(room).emit("receive-message", message)
  })

  socket.on("draw", (room) => {
    socket.nsp.to(room).emit("draw-result")
  })

  socket.on("winner", (room, peerId) => {
    socket.nsp.to(room).emit("winner-result", peerId)
  })

  socket.on("user-leave-room", async (peerId) => {
    try {
      const room = await Room.findOne({
        where: {
          [Op.or]: [
            {
              owner: peerId
            },
            {
              guest: peerId
            }
          ]
        }
      })
      // console.log("room yang ke delete : \n", room.dataValues)
      if (room) {
        socket.nsp.to(room.dataValues.name).emit("room-deleted")
        await room.destroy()
      }
    } catch (error) {
      console.log(error)
    }
  })
  socket.on("disconnect", () => {
    // console.log(socket.id, "has disconnected")
  })
})

// server.listen(PORT, () => {
//     console.log(`listening on ${PORT}`)
// })

module.exports = { server, io }