Crafty.init(800, 600, document.getElementById('gamecanvas'));

initialiseGame();

function initialiseGame () {
  loadBackground();
}

function loadBackground () {
  //Crafty.background("rgb( 0 , 230 , 230 )");
  Crafty.background('#FFFFFF url(img/bg.png) repeat-x center center');
}
