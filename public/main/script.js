//拿到登录的token
let token = JSON.parse(localStorage.getItem("token"))
//console.log(token)
//判断值是否为空
if (!token) {
    window.location = '../login/'
}

const socket = io('http://127.0.0.1:3008', {query: {id: token.nickname}});

//获取到输出框，用于修改内容
let output = document.getElementsByClassName("output");

//客户端连接成功后触发
socket.on('connect', () => {
    //将连接着的昵称传到服务端
    socket.emit('login', token.nickname)
});

//客户端登陆时触发
socket.on('login', (login) => {
    console.log("登录", login)
    output[0].innerHTML += `<p class="joinin">${login} 已连接</p>`;
    output[0].scrollTop = output[0].scrollHeight;
});

socket.on('disc', (disconnect) => {
    console.log("断连", disconnect)
    output[0].innerHTML += `<p class="joinin">${disconnect} 已断开</p>`;
    output[0].scrollTop = output[0].scrollHeight;
});

//发送消息时触发
socket.on('message', (message) => {
    //将字符串转回对象
    console.log(message)
    let data = JSON.parse(message)
    if (data.nickname == token.nickname) {
        output[0].innerHTML += `<div class="selfuser">${data.nickname}</div>
                                <div class="selfmessage">${data.value}</div>
                                <div class="clear"></div>`;
    } else {
        output[0].innerHTML += `<div class="otheruser">${data.nickname}</div>
                                <div class="othermessage">${data.value}</div>`;
    }
    output[0].scrollTop = output[0].scrollHeight;
});

sendForm.addEventListener('submit', function (e) {
    e.preventDefault()
    let toSend = {nickname: token.nickname, value: this.tosend.value}
    if (toSend.value) {
        socket.emit('message', JSON.stringify(toSend))
    }
    console.log(toSend.nickname)
    //清空input
    document.getElementsByClassName("input")[0].value = "";
})









// // 当连接关闭时，显示一个提示信息
// socket.onclose = function(event) {
//     if (event.wasClean) {
//         alert(`Connection closed cleanly, code=${event.code} reason=${event.reason}`);
//     } else {
//         alert('连接中断');
//     }
// };

// sendForm.addEventListener('submit', function (e) {
//     e.preventDefault()
//     let toSend = {nickname: token.nickname, value: this.tosend.value}
//     if (toSend.value) {
//         socket.send(JSON.stringify(toSend))
//     }
//     console.log(toSend.nickname)
//     //清空input
//     document.getElementsByClassName("input")[0].value = "";
// })
// // 当发生错误时，显示一个警告信息
// socket.onerror = function(error) {
//     alert(`Error: ${error.message}`);
// };

