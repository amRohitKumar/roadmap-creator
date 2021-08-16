const addPrivate = document.querySelector('#addPrivate');
const addPublic = document.querySelector('#addPublic');
const joinPublic = document.querySelector('#joinPublic');
const viewPrivate = document.querySelector('#viewPrivate');
const viewPublic = document.querySelector('#viewPublic');

let currLink = window.location.pathname;
console.log(window.location.pathname)
console.log(currLink);
if(currLink === '/public'){
    addPrivate.classList.add('hideClass');
    addPublic.classList.remove('hideClass');
    joinPublic.classList.remove('hideClass');
    viewPublic.classList.add('active');
    viewPrivate.classList.remove('active');
}
else if(currLink === '/private'){
    addPrivate.classList.remove('hideClass');
    addPublic.classList.add('hideClass');
    joinPublic.classList.add('hideClass');
    viewPublic.classList.remove('active');
    viewPrivate.classList.add('active');
}

// viewPrivate.addEventListener('mouseenter',   function(){
//     this.classList.add('active');
// })
// viewPrivate.addEventListener('mouseleave',   function(){
//     this.classList.remove('active');
// })
// viewPublic.addEventListener('mouseenter',   function(){
//     this.classList.add('active');
// })
// viewPublic.addEventListener('mouseleave',   function(){
//     this.classList.remove('active');
// })