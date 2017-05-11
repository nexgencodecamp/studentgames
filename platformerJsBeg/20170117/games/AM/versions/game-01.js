Crafty.init(800, 600, document.getElementById('gamecanvas'));

initialiseGame();

function initialiseGame () {
  loadBackground();
}

function loadBackground () {
  //Crafty.background('#69F100');
  Crafty.background('#FFFFFF url(img/sun.png) repeat-x center center');
}
