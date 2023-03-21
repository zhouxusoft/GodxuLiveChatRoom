// 创建一个WebSocket对象，连接到ws://localhost:3008
let socket = new WebSocket("ws://localhost:3008");

// 当连接打开时，发送一条消息给服务器
socket.onopen = function(e) {
    socket.send("已连接");
};

// 当收到服务器的消息时，将它显示在网页上
socket.onmessage = function(event) {
    console.log(event.data)
    let output = document.getElementsByClassName("output");
    output[0].innerHTML += `<p>${event.data}</p>`;
};

// 当连接关闭时，显示一个提示信息
socket.onclose = function(event) {
    if (event.wasClean) {
        alert(`Connection closed cleanly, code=${event.code} reason=${event.reason}`);
    } else {
        alert('连接中断');
    }
};

sendForm.addEventListener('submit', function (e) {
    e.preventDefault()
    let toSend = this.tosend.value
    socket.send(toSend)
    console.log(toSend)
})
// 当发生错误时，显示一个警告信息
socket.onerror = function(error) {
    alert(`Error: ${error.message}`);
};

