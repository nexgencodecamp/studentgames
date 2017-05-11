/** ADD BACKROUND **/

Crafty.init(800, 600, document.getElementById('gamecanvas'));

initialiseGame();

function initialiseGame () {
  loadBackground();
}

function loadBackground () {
//Crafty.background('#0000ff');
Crafty.background('#FFFFFF url(img/DesertBG.png) repeat-x center center');
}
