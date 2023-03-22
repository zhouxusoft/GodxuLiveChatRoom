// 引入ws模块
const WebSocket = require('ws');

// 创建一个WebSocket服务器实例，监听3000端口
const wss = new WebSocket.Server({ port: 3008 });

let onlineCount = 0;

// 当有客户端连接时，触发connection事件
wss.on('connection', function connection(ws) {
  // 当收到客户端消息时，触发message事件
  ws.on('message', function incoming(message) {
    // 把消息原样返回给客户端
    wss.emit("B",message.toString())
    ws.send(message.toString());
    console.log(message.toString());
  });

});
