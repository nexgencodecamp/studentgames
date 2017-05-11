Crafty.init(1200, 500, document.getElementById('gamecanvas'));

initialiseGame();

function initialiseGame () {
  loadBackground();
}

function loadBackground () {
  Crafty.background('#3BB9FF');
  Crafty.background('#FFFFFF url(img/bg.png) repeat-x center center');
}
