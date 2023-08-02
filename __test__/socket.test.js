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
  });

  afterEach(function (done) {
    if (socket.connected) {
      console.log("disconnecting...");
    } else {
      console.log("no connection to break...");
    }
    if (secondSocket.connected) {
      console.log("disconnecting...");
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

  test("should emit 'draw-result' event when a user sends a draw signal", (done) => {
    const username = "John";
    const peerId = "12345";

    socket.emit("join-room", username, peerId);

    socket.on("assign-room", () => {
      socket.emit("draw", peerId);
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
      const winnerId = "98765";
      socket.emit("winner", peerId, winnerId);
      socket.on("winner-result", (receivedWinnerId) => {
        expect(receivedWinnerId).toBe(winnerId);
        done();
      });
    });
  }, 5000);

  it("should emit 'set-ready' to all players in the room", (done) => {
    const room = "test-room";
    socket.emit("join-room", "John", "12345");
    secondSocket.emit("join-room", "Alice", "56789");
    let receivedEvents = 0;
    const onSetReady = () => {
      receivedEvents++;
      if (receivedEvents === 2) {
        done();
      }
    };
    setTimeout(() => {
      socket.emit("players-ready", room);
      secondSocket.on("set-ready", onSetReady);
      socket.on("set-ready", onSetReady);
    }, 500);
    done();
  });

  test("should emit 'receive-shake' event to all players in the room", (done) => {
    const room = "test-room";
    const mockShake = { some: "data" };
    socket.emit("join-room", "John", "12345");
    secondSocket.emit("join-room", "Alice", "56789");
    setTimeout(() => {
      socket.emit("send-shake", room, mockShake);
      socket.on("receive-shake", (receivedShake) => {
        expect(receivedShake).toEqual(mockShake);
        done();
      });

      secondSocket.on("receive-shake", (receivedShake) => {
        expect(receivedShake).toEqual(mockShake);
      });
    }, 500);
    done();
  });


  test("should handle 'disconnect' event when a user disconnects", (done) => {
    const username = "John";
    const peerId = "12345";

    socket.emit("join-room", username, peerId);

    socket.on("assign-room", () => {
      socket.disconnect();
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
  

  test('should handle "user-leave-room" event', (done) => {
    socket.emit('join-room', 'User1', 'PeerId1');
    socket.on('assign-room', (roomName) => {
      socket.emit('user-leave-room', 'PeerId1');
      socket.on('room-deleted', () => {
      });
      done();
      socket.emit("room-deleted");
    });
  });
  
});