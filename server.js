const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

//导入用户路由模块
const userRouter = require('./router/user')

//导入cors中间件
const cors = require('cors')

//将cors注册为全局中间件
app.use(cors())

//在所有路由之前封装一个res.cc()函数
app.use((req, res, next) => {
    //status默认值为1，表示失败
    //err的值，可以是一个错误对象，也可以是一个错误描述字符串
    res.cc = function(err, status = 1) {
        res.send({status, message: err instanceof Error ? err.message : err})
    }
    next()
})

//全局挂载用户路由
app.use('/api', userRouter)

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