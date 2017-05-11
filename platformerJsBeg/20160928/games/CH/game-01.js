/** ADD BACKROUND **/

Crafty.init(800, 600, document.getElementById('gamecanvas'));

initialiseGame();

function initialiseGame () {
  loadBackground();
}

function loadBackground () {
  //Crafty.background('#ff0000');
  Crafty.background('#FFFFFF url(img/snowBG.png) repeat-x center center');
}
