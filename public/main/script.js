// 创建一个WebSocket对象，连接到ws://localhost:3008
let socket = new WebSocket("ws://localhost:3008");

//拿到登录的token
let token = JSON.parse(localStorage.getItem("token"))
console.log(token)
//判断值是否为空
if (!token) {
    window.location = '../login/'
}

//获取到输出框，用于修改内容
let output = document.getElementsByClassName("output");

// 当连接打开时，发送一条消息给服务器
socket.onopen = function(e) {
    output[0].innerHTML += `<p class="joinin">${token.nickname} 已连接</p>`;
};

// 当收到服务器的消息时，将它显示在网页上
socket.onmessage = function(event) {
    //将字符串转回对象
    console.log(event.data)
    let data = JSON.parse(event.data)
    if (data.nickname == token.nickname) {
        output[0].innerHTML += `<div class="selfuser">${data.nickname}</div>
                                <div class="selfmessage">${data.value}</div>
                                <div class="clear"></div>`;
    } else {
        output[0].innerHTML += `<div class="otheruser">${data.nickname}</div>
                                <div class="othermessage">${data.value}</div>`;
    }
    output[0].scrollTop = output[0].scrollHeight;
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
    let toSend = {nickname: token.nickname, value: this.tosend.value}
    if (toSend.value) {
        socket.send(JSON.stringify(toSend))
    }
    console.log(toSend.nickname)
    //清空input
    document.getElementsByClassName("input")[0].value = "";
})
// 当发生错误时，显示一个警告信息
socket.onerror = function(error) {
    alert(`Error: ${error.message}`);
};

