Crafty.init(800, 600, document.getElementById('gamecanvas'));

initialiseGame();

function initialiseGame () {
  loadBackground();
}

function loadBackground () {
  Crafty.background('#FFFFFF');
  Crafty.background('RGB (230 , 50 , 50) url)(img/bombSprite.png) repeat center center');
}
