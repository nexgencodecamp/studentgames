const TILE_WIDTH = 80;
const TILE_HEIGHT = 60;

var tileMap = [
  [[4],4,[14],4,[4],4,[4],4,[4],4,[4],4,[4]],
  [[4],4,[4],4,[4],4,[28]],
  [[4],[24],4,[4],4,[7],8,[4]],
  [[6],[3],4,[15],4,[13],4,[6]],
  [[8],[8],4,[19],8,[11]],
  [[4],[1],4,[38]],
  [[4],[12]],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
];

Crafty.init(800, 600, document.getElementById('gamecanvas'));

var assets = {
  'tiles': ['img/tile-1.png', 'img/platform.png', 'img/platformx2.png']
};
initialiseGame();

function initialiseGame () {
  Crafty.load(assets, function(){
    loadBackground();
    generateMap();
  });
}

function loadBackground () {
  Crafty.background('#3BB9FF');
}

function generateMap () {
  const Y_OFFSET = 600 - (tileMap.length * TILE_HEIGHT);
  tileMap.map(function (tileRow, rowIdx) {
    var xPos = 0;
    var yPos = 0;
    tileRow.map(function (tile, tileIdx) {
      yPos = Y_OFFSET + (rowIdx * 60);
      if (tile.constructor === Array){
        /* Advance the x-position by the number of 'blank tiles' */
        xPos += tile[0] * 80;
      }
      if (tile === 1) {
        Crafty.e('FloorTile, 2D, DOM, Image, Collision')
          .attr({ x: xPos, y: yPos, w: TILE_WIDTH, h: TILE_HEIGHT })
          .image(Crafty.assets['img/tile-' + tile + '.png'].src);
      }
      else if (tile === 4) {
        var t = Crafty.e('Platform', {w: 160}).setImage('img/platform.png');
        t.position.x = xPos;
        t.position.y = yPos;
        t.placePlatform(1);
        t.addCoins(Crafty.math.randomInt(1,2));
      }
      else if (tile === 8) {
        var t = Crafty.e('Platform', {w: 320}).setImage('img/platformx2.png');
        t.position.x = xPos;
        t.position.y = yPos;
        t.placePlatform(2);
        t.addCoins(Crafty.math.randomInt(1,2));
      }
      xPos += 80;
    });
  });
}
