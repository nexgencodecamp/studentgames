Crafty.init(800, 600, document.getElementById('gamecanvas'));

initialiseGame();

function initialiseGame () {
  loadBackground();
}

function loadBackground () {
  //Crafty.background('rgb(255 ,143 ,255)');
  //Crafty.background('#3BB9FF');
  Crafty.background('#FFFFFF url(img/tile-1.png) repeat-x center center');
}
