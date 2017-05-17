__colorIdx = -1;
__colors = [
    "#22333b",
    "#b298dc",
    "#685765",
    "#c4d6c8",
    "#d6c4d2",
    "#e2d0bd",
    "#f2bfdf",
    "#f5f5f5",
    "#b4ccdb",
    "#0099cc",
    "#35c0b2",
    "#b8b7bb",
    "#b2adb8",
    "#533126",
    "#264853",
    "#433159",
    "#2f1b47",
    "#d46977",
    "#b4ccdb",
    "#e5a4ad",
    "#ff9f6a",
    "#1ffdc4",
    "#fd1f58",
    "#6a008e",
    "#5926c9",
    "#aa4fd0",
    "#253bbb",
    "#ba36d0",
    "#ad5aad",
    "#800080",
    "#ff9f6a",
    "#ff6a80",
    "#2faced",
    "#0ba6b0",
    "#052131",
    "#fef65b",
    "#bbbbee",
    "#7bcd8a",
    "#cfa5df",
    "#2d74b2",
    "#a8cff3",
    "#ab3456"
]


$(window).scroll(function() {
    if ($(document).height() == $(window).scrollTop() + $(window).height()) {
        $("div:hidden").slice(0, 8).addClass('display');
        if ($("div:hidden").length == 0) {
            $("#load").fadeOut('slow');
        }

        // $('html,body').animate({
        //     scrollTop: $(this).offset().top
        // }, 1500, );
    }
});


$(window).scroll(function() {
    if ($(this).scrollTop() > 50) {
        $('.totop a').fadeIn();
    } else {
        $('.totop a').fadeOut();
    }

    if($(this).scrollTop() % 200 < 10 && $(this).scrollTop() % 200 > 0 && $(this).scrollTop() > 750){
        $('body').css('background', __colors[++__colorIdx]);
        if(__colorIdx > 41)
            __colorIdx = -1;
    }
    if($(this).scrollTop() < 750){
        $('body').css('background', 'rgb(1, 167, 225)');
    }

});
