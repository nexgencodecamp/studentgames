Crafty.init(800, 600, document.getElementById('gamecanvas'));

initialiseGame();

function initialiseGame () {
  loadBackground();
}

function loadBackground () {
//  Crafty.background('#4bd6ac');
 Crafty.background('FFFFFF url(img/BaG.jpg) repeat-x center center');
}
