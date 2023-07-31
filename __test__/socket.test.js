const io = require("socket.io-client");
const { io: server } = require("../app");

describe("socket testing", () => {
    server.attach(3000);
    let socket;

    beforeEach(function (done) {
        socket = io("http://localhost:3000");

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
        done();
    });

    afterAll(function (done) {
        socket.disconnect();
        server.close();
        done();
    });

    test("should join the room and emit assign-room event", (done) => {
        const username = "John";
        const peerId = "12345";

        socket.emit("join-room", username, peerId);

        socket.on("assign-room", (room) => {
            expect(room).toBe(peerId);
            done();
        });
    }, 5000);

    test("should emit 'timer-ready' event on 'start-timer' event", (done) => {
        const room = "room1";

        socket.emit("start-timer", room);

        socket.on("timer-ready", () => {
            expect(true).toBe(true);
            done();
        });
    }, 5000);

    test("should emit 'receive-message' event on 'send-message' event", (done) => {
        const room = "room1";
        const message = "Hello, world!";

        socket.emit("send-message", message, room);

        socket.on("receive-message", (receivedMessage) => {
            expect(receivedMessage).toBe(message);
            done();
        });
    }, 5000);

});