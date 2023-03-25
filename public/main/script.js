//拿到登录的token
//判断值是否为空
let token = JSON.parse(localStorage.getItem("token"))

//0.5s后再进行判断 为了防止页面刷新过快而出现token为空的误判
if (!token) {
    window.location = '../login/'
}

const socket = io('http://127.0.0.1:30018', {
    query: { id: token.nickname }
});

//获取到输出框，用于修改内容
let output = document.getElementsByClassName("output");
let header = document.getElementsByClassName("header");
let menu = document.getElementsByClassName("menu");

//获取输入框，用于判断其内部的内容
//获取发送按钮
let inputElement = document.getElementsByClassName("input");
let btn = document.getElementsByClassName("btn")
let btndown = document.getElementsByClassName("btndown")

//给输入框添加监听事件，判断内容
//input中有内容 箭头向上 代表发送
//无内容 箭头向下 代表打开下拉菜单

inputElement[0].addEventListener('input', (event) => {
    let inputValue = event.target.value;
    if (inputValue) {
        btn[0].classList.remove("btndown")
        btn[0].classList.add("btnup")
        if (output[0].style.height == "420px") {
            output[0].style.height = "470px"
            menu[0].style.height = "7px"
        }
    } else {
        btn[0].classList.add("btndown")
        btn[0].classList.remove("btnup")
    }
});

btndown[0].addEventListener("click", function () {
    //点击事件先判断是否有值，若没有，则打开下拉菜单
    if (!inputElement[0].value) {
        if (output[0].style.height == "420px") {
            output[0].style.height = "470px"
            menu[0].style.height = "7px"
        } else {
            output[0].style.height = "420px"
            menu[0].style.height = "57px"
        }
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
    btn[0].classList.add("btndown")
    btn[0].classList.remove("btnup")
})

//获取元素
let pop = document.getElementsByClassName("pop")[0];
let overlay = document.getElementsByClassName("overlay")[0];
let exit = document.getElementById("exit");
let changeinfo = document.getElementById("changeinfo");
let sendfile = document.getElementById("sendfile");
let sendimg = document.getElementById("sendimg");
let changeroom = document.getElementById("changeroom");

//显示/关闭弹窗
function showPop() {
    //每打开一次 其内部的元素都应该重新加载一遍
    while (pop.firstChild) {  
        pop.removeChild(pop.firstChild);
    }
    pop.style.display = "block";
    overlay.style.display = "block";

    //添加并获取关闭按钮 注册监听事件
    pop.innerHTML += `<div class="closebtn"></div>`;
    pop.addEventListener("click", function (event) {
        if (event.target.classList.contains("closebtn")) {
            hidePop();
        }
    });

    // //添加并获取关闭按钮 注册监听事件
    // pop.innerHTML += `<div class="closebtn"></div>`;
    // let closebtn = pop.querySelector(".closebtn");
    // closebtn.addEventListener("click", function () {
    //     hidePop()
    // });
}

function hidePop() {
    pop.style.display = "none";
    overlay.style.display = "none";
}

//退出登录点击事件
exit.addEventListener("click", function () {
    showPop()
    pop.innerHTML += `<div class="exit">是否确认退出</div>
                      <div class="makesure">
                          <div class="makesurebtn" id="yesbtn">确认</div>
                          <div class="makesurebtn" id="nobtn">取消</div>
                      </div>`;
    let yesbtn = document.getElementById("yesbtn");
    let nobtn = document.getElementById("nobtn");
    yesbtn.addEventListener("click", function () {
        localStorage.clear()
        window.location = '../login/'
    });
    nobtn.addEventListener("click", function () {
        hidePop()
    });
});

//修改昵称点击事件
changeinfo.addEventListener("click", function () {
    showPop()
});

//发送文件点击事件
sendfile.addEventListener("click", function () {
    showPop()
});

//发送图片点击事件
sendimg.addEventListener("click", function () {
    showPop()
});

//修改房间点击事件
changeroom.addEventListener("click", function () {
    showPop()
});