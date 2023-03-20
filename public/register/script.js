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
