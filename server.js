const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

//导入数据库操作模块
const db = require('./database/index')

//默认加载页面
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/main/');
});

//静态资源托管
app.use(express.static(__dirname + "/public/"));
app.use(express.static(__dirname + "/public/main/"));

io.on('connection', (socket) => {
    socket.on('message', (message) => {
        let ins = JSON.parse(message)
        const sql = 'insert into usermessage set ?'
        db.query(sql, { 
            userid: ins.userid,
            nickname: ins.nickname, 
            message: ins.message,
            time: ins.time,
            room: ins.room}, (err, results) => {
                if (err) throw err;
            })
        io.emit('message', message)
    });
    socket.on('login', (login) => {
        //console.log(login)
        io.emit('login', login)
        io.emit('count', io.engine.clientsCount)
        const sql = 'SELECT * FROM usermessage WHERE room = 1 ORDER BY id LIMIT 50 OFFSET 0;'
        db.query(sql, 1, (err, results) => {
            if (err) throw err;
            for (let i = 0; i < results.length; i++) {
                let message = results[i]
                socket.emit("message", JSON.stringify(message))
            }
        })
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