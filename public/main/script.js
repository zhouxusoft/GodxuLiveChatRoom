//拿到登录的token
//判断值是否为空
let token = JSON.parse(localStorage.getItem("token"))

//0.5s后再进行判断 为了防止页面刷新过快而出现token为空的误判
if (!token) {
    window.location = '../login/'
}

const socket = io('http://localhost:30018', {
    query: { id: token.nickname }
});

//获取到输出框，用于修改内容
let output = document.getElementsByClassName("output");
let header = document.getElementsByClassName("header");
let bottombox = document.getElementsByClassName("box");

//获取输入框，用于判断其内部的内容
//获取发送按钮
let inputElement = document.getElementsByClassName("input");
let btn = document.getElementsByClassName("btn")

//给输入框添加监听事件，判断内容
//input中有内容 箭头向上 代表发送
//无内容 箭头向下 代表打开下拉菜单
inputElement[0].addEventListener('input', (event) => {
    let inputValue = event.target.value;
    if (inputValue) {
        btn[0].classList.remove("btndown")
        btn[0].classList.add("btnup")
        output[0].style.height = "400px"
        bottombox[0].style.height = "94px"
    } else {
        btn[0].classList.add("btndown")
        btn[0].classList.remove("btnup")
        output[0].style.height = "450px"
        bottombox[0].style.height = "44px"
    }
});

//客户端连接成功后触发
socket.on('connect', () => {
    //将连接着的昵称传到服务端
    socket.emit('login', token.nickname)
});

//客户端登陆时触发
socket.on('login', (login) => {
    //console.log("登录", login)
    const elements = document.querySelectorAll('.joinin');
    elements.forEach(function (element) {
        element.remove();
    });
    header[0].innerHTML += `<span class="joinin">${login} 已连接</span>`;
    header[0].scrollTop = header[0].scrollHeight;
});

socket.on('disc', (disconnect) => {
    //console.log("断连", disconnect)
    const elements = document.querySelectorAll('.joinin');
    elements.forEach(function (element) {
        element.remove();
    });
    header[0].innerHTML += `<span class="joinin">${disconnect} 已断开</span>`;
    header[0].scrollTop = header[0].scrollHeight;
});

//人数变化
socket.on('count', (connCount) => {
    //console.log(connCount)
    const elements = document.querySelectorAll('.count');
    elements.forEach(function (element) {
        element.remove();
    });
    header[0].innerHTML += `<span class="count">在线人数：${connCount}</span>`;
    header[0].scrollTop = header[0].scrollHeight;
});

//发送消息时触发
socket.on('message', (message) => {
    //将字符串转回对象
    //console.log(message)
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
    let toSend = { nickname: token.nickname, value: this.tosend.value }
    if (toSend.value) {
        socket.emit('message', JSON.stringify(toSend))
    }
    //console.log(toSend.nickname)
    //清空input
    inputElement[0].value = "";
})