jQuery(document).ready(function($) { 
  $(".info a, #whoami a").click(function(event){        
    event.preventDefault();
    $('html,body').animate({scrollTop:$(this.hash).offset().top}, 1200);
 });
});

$(document).ready(function() {
  $('html').niceScroll({
    cursorborder: '#E1EFE9',
    cursorcolor:  '#E1EFE9'
  });
});
