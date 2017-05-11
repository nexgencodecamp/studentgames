Crafty.init(800, 600, document.getElementById('gamecanvas'));

initialiseGame();

function initialiseGame () {
  loadBackground();
}

function loadBackground () {
  //Crafty.background('#3BB9FF');
  //Crafty.background('rgb( 100 , 200 , 200 )');
  Crafty.background('#FFFFFF url(img/playerSprite.png) repeat top left');
}
