$(window).scroll(function(){
       if($(document).height()==$(window).scrollTop()+$(window).height()){

        $("div:hidden").slice(0, 8).addClass('display');        
        if ($("div:hidden").length == 0) {
            $("#load").fadeOut('slow');
        }

        $('html,body').animate({

            scrollTop: $(this).offset().top
        }, 1500,);

       }

   });


$(window).scroll(function () {

    if ($(this).scrollTop() > 50) {
        $('.totop a').fadeIn();
    } 

    else {
        $('.totop a').fadeOut();
    }
    
});

