jQuery(document).ready(function($) { 
  $(".info a").click(function(event){        
    event.preventDefault();
    $('html,body').animate({scrollTop:$(this.hash).offset().top}, 1200);
 });
});

$(document).ready(function() {
  $('html').niceScroll({
    cursorborder: '#d1ff83',
    cursorcolor:  '#d1ff83'
  });
});