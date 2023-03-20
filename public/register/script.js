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
let pwd;
let username;

function userName(data) {
    username = data

    const length = new RegExp('(?=.{1,})')
    
    if(length.test(data)) {
        userLengthCase.classList.add('valid')
    }
    else {
        userLengthCase.classList.remove('valid')
    }
}

function checkPassword(data) {
    pwd = data;

    const length = new RegExp('(?=.{6,})')

    if(length.test(data)) {
        lengthCase.classList.add('valid')
    }
    else {
        lengthCase.classList.remove('valid')
    }
} 
function recheckPassword(data) {
    if (data === '') {
        recheckCase.classList.remove('valid')
    }
    else if(data === pwd) {
        recheckCase.classList.add('valid')
    }
    else {
        recheckCase.classList.remove('valid')
    }
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