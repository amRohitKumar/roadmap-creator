const addPrivate = document.querySelector('#addPrivate');
const addPublic = document.querySelector('#addPublic');
const joinPublic = document.querySelector('#joinPublic');
const mover = document.querySelector('.hori-selector');

let currLink = window.location.pathname;
console.log(window.location.pathname)
console.log(currLink);
if(currLink === '/public'){
    mover.classList.remove('hideClass');
    addPrivate.classList.add('hideClass');
    joinPublic.classList.remove('hideClass');
}
else if(currLink === '/private'){
    mover.classList.remove('hideClass');
    addPrivate.classList.remove('hideClass');
    addPublic.classList.add('hideClass');
    joinPublic.classList.add('hideClass');
}
else{
    addPrivate.classList.add('hideClass');
    addPublic.classList.add('hideClass');
    joinPublic.classList.add('hideClass');
    mover.classList.add('hideClass');
}

