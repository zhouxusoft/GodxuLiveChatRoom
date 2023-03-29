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

    //客户端发送消息时触发
    socket.on('message', (message) => {
        let ins = JSON.parse(message)
        const sql = 'insert into usermessage set ?'
        //console.log(ins.message)
        db.query(sql, { 
            userid: ins.userid,
            nickname: ins.nickname, 
            message: ins.message,
            time: ins.time,
            room: ins.room
            }, (err, results) => {
                if (err) throw err;
            })
        io.emit('message', message)
    });

    //客户端登录时触发
    socket.on('login', (login) => {
        //console.log(login)
        //向所有客户端广播有用户登录
        login = JSON.parse(login)
        io.emit('login', login.nickname)
        io.emit('count', io.engine.clientsCount)
        //刚登陆的客户端查询历史聊天记录
        const sql = 'SELECT * FROM usermessage WHERE room = ? ORDER BY id DESC LIMIT 50;'
        db.query(sql, login.room, (err, results) => {
            if (err) throw err;
            for (let i = results.length - 1; i >= 0; i--) {
                let message = results[i]
                socket.emit("message", JSON.stringify(message))
            }
        })
    });

    //断联时触发
    socket.on('disconnect', () => {
        //console.log(123)
        const customId = socket.handshake.query.id;
        socket.id = customId;
        io.emit('disc', socket.id)
        io.emit('count', io.engine.clientsCount)
    });

    //点击房间列表时触发
    socket.on('roomlist', (token) => {
        const sql = `SELECT * FROM roomtable`
        db.query(sql, (err, results) => {
            if (err) return err;
            socket.emit("roomlist", results)
        })
    });
});

//启动服务器
server.listen(30018, () => {
    console.log("localhost:30018")
});