Crafty.init(800, 600, document.getElementById('gamecanvas'));

initialiseGame();

function initialiseGame () {
  loadBackground();
}

function loadBackground () {
  //Crafty.background('#FF0000');
  Crafty.background('#FFFFFF url(img/platformx2.png) repeat-x center center');
}
