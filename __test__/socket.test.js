const io = require("socket.io-client");
const { io: server } = require("../app");

describe("socket testing", () => {
  server.attach(3010);
  let socket;
  const secondSocket = io("http://localhost:3010");

  beforeEach(function (done) {
    socket = io("http://localhost:3010");

    secondSocket.on("connect", () => {
      console.log("second connect worked");
    });

    socket.on("connect", function () {
      console.log("worked...");
      done();
    });
    socket.on("disconnect", function () {
      console.log("disconnected...");
    });
  });

  afterEach(function (done) {
    if (socket.connected) {
      console.log("disconnecting...");
      socket.disconnect();
    } else {
      console.log("no connection to break...");
    }
    if (secondSocket.connected) {
      console.log("disconnecting...");
      secondSocket.disconnect();
    } else {
      console.log("no connection to break...");
    }
    done();
  });

  afterAll(function (done) {
    socket.disconnect();
    secondSocket.disconnect();
    server.close();
    done();
  });

  test("should emit 'call-user' event when a user joins an existing room", (done) => {
    const username = "John";
    const peerId = "12345";

    socket.emit("join-room", username, peerId);

    const username2 = "Alice";
    const peerId2 = "67890";
    secondSocket.emit("join-room", username2, peerId2);

    socket.on("call-user", (room) => {
      expect(room).toBe(peerId);
    });
    done();
  }, 5000);

  test("should emit 'set-ready' event when a user is ready", (done) => {
    const username = "John";
    const peerId = "12345";

    socket.emit("join-room", username, peerId);

    socket.on("assign-room", () => {
      socket.emit("players-ready", peerId);

      socket.on("set-ready", () => {
      });
    });
    done();
  }, 5000);

  // socketnya bisa jalan ketika nsp-nya dihapus, line 51, 54
  test("should receive 'receive-message' event when a message is sent", (done) => {
    const username = "John";
    const peerId = "12345";
    const message = "Hello, World!";

    socket.emit("join-room", username, peerId);
    secondSocket.emit("join-room", username, peerId);


    socket.on("assign-room", () => {
      console.log("assign room");
      socket.emit("send-message", message, peerId);
    });

    secondSocket.on("receive-message", (receivedMessage) => {
      expect(receivedMessage).toBe(message);
    });
    done();
  }, 5000);

  // test("should emit 'room-deleted' event when a user leaves the room", (done) => {
  //   const username = "John";
  //   const peerId = "12345";

  //   socket.emit("join-room", username, peerId);

  //   socket.on("assign-room", () => {
  //     socket.emit("user-leave-room", peerId);

  //     socket.on("room-deleted", () => {
  //     });
  //   });
  //   done();
  // }, 5000);

  test("should emit 'draw-result' event when a user sends a draw signal", (done) => {
    const username = "John";
    const peerId = "12345";

    socket.emit("join-room", username, peerId);

    socket.on("assign-room", () => {
      // User sends a draw signal
      socket.emit("draw", peerId);

      // The room should receive 'draw-result' event
      socket.on("draw-result", () => {
      });
      done();
    });
  }, 5000);

  test("should emit 'winner-result' event when a user sends a winner signal", (done) => {
    const username = "John";
    const peerId = "12345";

    socket.emit("join-room", username, peerId);

    socket.on("assign-room", () => {
      // User sends a winner signal
      const winnerId = "98765";
      socket.emit("winner", peerId, winnerId);

      // The room should receive 'winner-result' event with the winner ID
      socket.on("winner-result", (receivedWinnerId) => {
        expect(receivedWinnerId).toBe(winnerId);
        done();
      });
    });
  }, 5000);

  test("should handle 'disconnect' event when a user disconnects", (done) => {
    const username = "John";
    const peerId = "12345";

    socket.emit("join-room", username, peerId);

    socket.on("assign-room", () => {
      // Simulate user disconnection
      socket.disconnect();

      // Server should log the disconnection
      done();
    });
  }, 5000);

  test("should emit 'room-deleted' event when a user leaves the room", (done) => {
    const username1 = "John";
    const peerId1 = "12345";

    socket.emit("join-room", username1, peerId1);

    socket.on("assign-room", () => {
      const username2 = "Alice";
      const peerId2 = "67890";

      secondSocket.emit("join-room", username2, peerId2);

      secondSocket.on("assign-room", () => {
        secondSocket.emit("user-leave-room", peerId2);

        socket.on("room-deleted", () => {
          Room.findOne({ where: { name: peerId2 } }).then((room) => {
            expect(room).toBeNull();
          });
        });
      });
      done();
    });
  }, 5000);

  it('should handle "user-leave-room" event', (done) => {
    // Emit "join-room" to create a room first
    socket.emit('join-room', 'User1', 'PeerId1');
    socket.on('assign-room', (roomName) => {
      // Emit "user-leave-room" to simulate a user leaving the room
      socket.emit('user-leave-room', 'PeerId1');
      // Wait for the server to process the event and emit "room-deleted"
      // await new Promise((resolve) => setTimeout(resolve, 100));
      socket.on('room-deleted', () => {
        done();
      });
      socket.emit("room-deleted");
    });
  });

});