// // import express from "express";
// const express = require("express");
// const path = require("path");

// const app = express();
// const server = require("http"). createServer(app);

// const io = require("socket.io")(server);

// app.use(express.static(path.join(__dirname + "/public")));

// io.on("connection", function(socket){
//     socket.on("newuser", function(username){
//         socket.broadcast.emit("update", username + " joined the conversation");
//     });
//     socket.on("exituser", function(username){
//         socket.broadcast.emit("update", username + " left the conversation");
//     });
//     socket.on("chat", function(message){
//         socket.broadcast.emit("chat", message);
//     });
// });

// server.listen(3000);

const express = require("express");
const path = require("path");
const http = require("http");

const app = express();
const server = http.createServer(app);

const io = require("socket.io")(server, {
    cors: {
        origin: "*", // Allow all origins; update for better security.
        methods: ["GET", "POST"]
    }
});

app.use(express.static(path.join(__dirname, "/public")));

io.on("connection", (socket) => {
    console.log("A user connected");

    socket.on("newuser", (username) => {
        socket.broadcast.emit("update", `${username} joined the conversation`);
    });

    socket.on("exituser", (username) => {
        socket.broadcast.emit("update", `${username} left the conversation`);
    });

    socket.on("chat", (message) => {
        socket.broadcast.emit("chat", message);
    });

    socket.on("disconnect", () => {
        console.log("A user disconnected");
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
