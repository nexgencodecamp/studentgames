Crafty.init(800, 600, document.getElementById('gamecanvas'));

initialiseGame();

function initialiseGame () {
  loadBackground();
}

function loadBackground () {
  Crafty.background('#33FF36');
  Crafty.background('#FFFFFF url(img/backgroundd.png) repeat-x center center');
}
