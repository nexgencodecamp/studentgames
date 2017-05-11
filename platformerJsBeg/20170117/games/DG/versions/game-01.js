Crafty.init(800, 600, document.getElementById('gamecanvas'));

initialiseGame();

function initialiseGame () {
  loadBackground();
}

function loadBackground () {
  //Crafty.background('rgb(100, 255, 255)');
  Crafty.background('#FFFFFF url(img/coinSprite.png) repeat center center');
}
