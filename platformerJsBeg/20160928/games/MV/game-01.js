/** ADD BACKROUND **/

Crafty.init(800, 600, document.getElementById('gamecanvas'));

initialiseGame();

function initialiseGame () {
  loadBackground();
}

function loadBackground () {
  Crafty.background('#FF3FFF');
  Crafty.background('#FFFFFF url(img/background.png) repeat-x center center');
}
