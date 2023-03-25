const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

//默认加载页面
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/main/');
});

//静态资源托管
app.use(express.static(__dirname + "/public/"));
app.use(express.static(__dirname + "/public/main/"));

io.on('connection', (socket) => {
    socket.on('message', (message) => {
        //console.log(message)
        io.emit('message', message)
    });
    socket.on('login', (login) => {
        //console.log(login)
        io.emit('login', login)
        io.emit('count', io.engine.clientsCount)
    });
    socket.on('disconnect', () => {
        //console.log(123)
        const customId = socket.handshake.query.id;
        socket.id = customId;
        io.emit('disc', socket.id)
        io.emit('count', io.engine.clientsCount)
    });
});


//启动服务器
server.listen(30018, () => {
    console.log("localhost:30018")
});