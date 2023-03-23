const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/main/');
});
//静态资源托管
app.use(express.static(__dirname + "/public/"));
app.use(express.static(__dirname + "/public/main/"));


io.on('connection', (socket) => {
    socket.on('message', (message) => {
        console.log(message)
        io.emit('message', message)
    });
    socket.on('login', (login) => {
        console.log(login)
        io.emit('login', login)
    });
    socket.on('disconnect', () => {
        console.log(123)
        const customId = socket.handshake.query.id;
        socket.id = customId;
        io.emit('disc', socket.id)
    });
});


//启动服务器
server.listen(3008, () => {
    console.log("127.0.0.1:3008")
});