Crafty.init(800, 600, document.getElementById('gamecanvas'));

initialiseGame();

function initialiseGame () {
  loadBackground();
}

function loadBackground () {
  Crafty.background('#3BB9FF');
  Crafty.background('#3BB9FF url(hg.png) repeat-x center center');
}
