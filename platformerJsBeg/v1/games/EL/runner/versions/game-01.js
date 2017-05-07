Crafty.init(800, 600, document.getElementById('gamecanvas'));

initialiseGame();

function initialiseGame () {
  loadBackground();
}

function loadBackground () {
  Crafty.background('#3BB9FF');
  Crafty.background('#FFFFFF url(img/bg.png) repeat-x center center');
}
