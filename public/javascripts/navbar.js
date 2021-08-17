const viewPrivate = document.querySelector('#viewPrivate');
const viewPublic = document.querySelector('#viewPublic');
const publicLi = document.querySelector('#publicLi');
const privateLi = document.querySelector('#privateLi');



// var activeItemNewAnim;
if(currLink === '/public'){
  viewPrivate.classList.remove('active');
  viewPrivate.removeAttribute('aria-current');
  viewPublic.classList.add('active');
  viewPublic.setAttribute('aria-current', 'page');
  viewPublic.style.color = "#0d6efd";
}
else if(currLink === '/private'){
  viewPrivate.classList.add('active');
  viewPrivate.setAttribute('aria-current', 'page');
  viewPublic.classList.remove('active');
  viewPublic.removeAttribute('aria-current');
  viewPrivate.style.color = "#0d6efd";
}

// ---------Responsive-navbar-active-animation-----------
function test(){
  var tabsNewAnim = $('#navbarSupportedContent'); // selecting the whoel div
  var selectorNewAnim = $('#navbarSupportedContent').find('li').length;
  var activeItemNewAnim = tabsNewAnim.find('.active');
  // console.log(activeItemNewAnim);

  var activeWidthNewAnimHeight = activeItemNewAnim.innerHeight();
  var activeWidthNewAnimWidth = activeItemNewAnim.innerWidth();
  var itemPosNewAnimTop = activeItemNewAnim.position();
  var itemPosNewAnimLeft = activeItemNewAnim.position();
  $(".hori-selector").css({
    "top":itemPosNewAnimTop.top + "px", 
    "left":itemPosNewAnimLeft.left + "px",
    "height": activeWidthNewAnimHeight + "px",
    "width": activeWidthNewAnimWidth + "px"
  });
  $("#navbarSupportedContent").on("click","li",function(e){
    $('#navbarSupportedContent ul li').removeClass("active");
    $(this).addClass('active');
    // var activeWidthNewAnimHeight = $(this).innerHeight();
    // var activeWidthNewAnimWidth = $(this).innerWidth();
    // var itemPosNewAnimTop = $(this).position();
    // var itemPosNewAnimLeft = $(this).position();
    $(".hori-selector").css({
      "top":itemPosNewAnimTop.top + "px", 
      "left":itemPosNewAnimLeft.left + "px",
      "height": activeWidthNewAnimHeight + "px",
      "width": activeWidthNewAnimWidth + "px"
    });
  });
}
$(document).ready(function(){
  setTimeout(function(){ test(); });
});
$(window).on('resize', function(){
  setTimeout(function(){ test(); }, 500);
});
$(".navbar-toggler").click(function(){
  setTimeout(function(){ test(); });
});