Crafty.init(800, 600, document.getElementById('gamecanvas'));

initialiseGame();

function initialiseGame () {
  loadBackground();
}

function loadBackground () {
  //Crafty.background('rgb(225,225,30)');
  //Crafty.background('#3BB9FF');
  Crafty.background('#FFFFFF url(img/splash.jpg) repeat-x center center');
}
