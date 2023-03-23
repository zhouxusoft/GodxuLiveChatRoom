let passwords = document.querySelectorAll('.passwordBox')
let logoButtons = document.querySelectorAll('.logoButton')
for (let i = 0; i < logoButtons.length; i++) {
    logoButtons[i].onclick = function () {
        if (passwords[i].type === 'password') {
            passwords[i].setAttribute('type', 'text')
            logoButtons[i].classList.add('hide')
        }
        else {
            passwords[i].setAttribute('type', 'password')
            logoButtons[i].classList.remove('hide')
        }
    }
}

let userLengthCase = document.getElementById('nameLength')
let lengthCase = document.getElementById('length')
let recheckCase = document.getElementById('recheck')
let btn = document.getElementById('register')
let pwd;
let username;
let userNameOK, checkPasswordOK, recheckPasswordOK = 0;

function inputOK(userNameOK, checkPasswordOK, recheckPasswordOK) {
    let a = userNameOK;
    let b = checkPasswordOK;
    let c = recheckPasswordOK;
    if (a == 1 && b == 1 && c == 1) {
        btn.disabled = false;
        btn.classList.remove('default')
        btn.classList.add('btn')
    } else {
        btn.disabled = true;
        btn.classList.remove('btn')
        btn.classList.add('default')
    }
}

//用于检测输入是否有空白符
function hasWhiteSpace(str) {
    return /\s/g.test(str);
}

function userName(data) {
    username = data
    //用于判断用户名长度是否在1-12字符之间
    const length = new RegExp('(^.{1,12}$)')

    if (length.test(data) && !hasWhiteSpace(data)) {
        userLengthCase.classList.add('valid')
        userNameOK = 1;
    }
    else {
        userLengthCase.classList.remove('valid')
        userNameOK = 0;
    }

    inputOK(userNameOK, checkPasswordOK, recheckPasswordOK)
}

function checkPassword(data) {
    pwd = data;

    const length = new RegExp('(?=.{6,})')

    if (length.test(data) && !hasWhiteSpace(data)) {
        lengthCase.classList.add('valid')
        checkPasswordOK = 1;
    }
    else {
        lengthCase.classList.remove('valid')
        checkPasswordOK = 0;
    }

    inputOK(userNameOK, checkPasswordOK, recheckPasswordOK)
}
function recheckPassword(data) {
    if (data === '') {
        recheckCase.classList.remove('valid')
    }
    else if (data === pwd) {
        recheckCase.classList.add('valid')
        recheckPasswordOK = 1;
    }
    else {
        recheckCase.classList.remove('valid')
        recheckPasswordOK = 0;
    }

    inputOK(userNameOK, checkPasswordOK, recheckPasswordOK)
}

const registerForm = document.getElementById('registerForm')

registerForm.addEventListener('submit', function (e) {
    e.preventDefault()
    let xhr = new XMLHttpRequest()
    let data = {
        username: this.username.value,
        password: this.password.value,
    }
    let formData = ''
    for (let key in data) {
        formData += encodeURIComponent(key) + '=' + encodeURIComponent(data[key]) + '&'
    }
    formData = formData.slice(0, -1)
    xhr.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            let resData = JSON.parse(this.response)
            if (resData.status == 0) {
                window.location = '../login/'
                alert(resData.message)
            } else {
                alert(resData.message)
            }
        }
    }
    xhr.open('POST', 'http://127.0.0.1:3007/api/register', true)
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
    xhr.send(formData)
})