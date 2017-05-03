Crafty.init(800, 600, document.getElementById('gamecanvas'));

initialiseGame();

function initialiseGame () {
  loadBackground();
}

function loadBackground () {
  Crafty.background('#3BB9FF');
Crafty.background  ('#3BB956');
Crafty.background ('url(img/grassy_80x60.png)');
Crafty.background ('url(img/BG.png)');
}
