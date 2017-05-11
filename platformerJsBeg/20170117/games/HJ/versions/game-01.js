Crafty.init(800, 600, document.getElementById('gamecanvas'));

initialiseGame();

function initialiseGame () {
  loadBackground();
}

function loadBackground () {
  //Crafty.background('rgb(0,255,255)');
  Crafty.background('#FFFFFF url(pictures/cameraRoll/background.JPEG) repeat center center');
}
