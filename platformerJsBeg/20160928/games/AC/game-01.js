/** ADD BACKROUND **/

Crafty.init(800, 600, document.getElementById('gamecanvas'));

initialiseGame();

function initialiseGame () {
  loadBackground();
}

function loadBackground () {
  //Crafty.background('#FF0010');
  Crafty.background('#FFFFFF url(img/BG.png) repeat-x center center');
}
