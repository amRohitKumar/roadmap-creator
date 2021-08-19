var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
  return new bootstrap.Tooltip(tooltipTriggerEl)
})

const initial = document.getElementById('initial');
const final = document.getElementById('final');
const btn = document.getElementById('copyId');
var copyText = document.querySelector('#uId');

btn.addEventListener('click', function(){
    copyText.select();
    copyText.setSelectionRange(0, 99999);
    // document.innerText.execCommand('copy');
    navigator.clipboard.writeText(copyText.value);
    // window.alert("Copied the text" + copyText.value);
    initial.classList.add('hideClass');
    final.classList.remove('hideClass');

    console.log(copyText);
})
