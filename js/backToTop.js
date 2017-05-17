$(document).ready(function() {
  var btt = $(".back-to-top");
  btt.on("click", function(e) {
      $("html, body").animate({
          scrollTop: 0
      }, 500);
      e.preventDefault();
  });

  $('#btnWebsite').on('click', function(){
      location.href="https://nexgencodecamp.com.au";
  })
  $('#btnBlog').on('click', function(){
      location.href="http://blog.nexgencodecamp.com.au";
  })

  $(window).on("scroll", function() {
    var self = $(this),
    height = self.height(),
    top = self.scrollTop();
  });


});
