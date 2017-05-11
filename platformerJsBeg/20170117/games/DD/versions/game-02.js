const TILE_WIDTH = 80;
const TILE_HEIGHT = 60;

var tileMap = [
  [[0,1],[8,1],[0,13],[4,1],[0,8],[8,1],[0,5],[4,1],[0,7],[8,1],[0,6],[8,1],[0,2]],
  [[0,8],[4,1],[0,3],[4,1],[0,6],[8,1],[0,28]],
  [[0,8],[0,24],[4,1],[0,3],[4,1],[0,6],[8,1],[0,4]],
  [[0,11],[4,1],[0,15],[4,1],[0,13],[4,1],[0,6]],
  [[0,16],[8,1],[0,19],[8,1],[0,11]],
  [[0,9],[4,1],[0,38]],
  [[0,48]],
  [[1,48]]
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
  //Crafty.background('#FFFFFF url(img/bg.png) repeat-x center center');
}

function generateMap () {
  const Y_OFFSET = 600 - (tileMap.length * TILE_HEIGHT);
  tileMap.map(function (tileRow, rowIdx) {
    var xPos = 0;
    var yPos = 0;
    tileRow.map(function (tile, tileIdx) {
      yPos = Y_OFFSET + (rowIdx * 60);
      var tileType = tile[0];
      var tileNum = tile[1];
      if (tileType === 0){
        xPos += (tileNum * 80);
      }
      if (tileType === 1) {
        for(var i=0; i < tileNum; i++){
          Crafty.e('FloorTile, 2D, DOM, Image, Collision')
            .attr({ x: xPos, y: yPos, w: TILE_WIDTH, h: TILE_HEIGHT })
            .image(Crafty.assets['img/tile-' + tileType + '.png'].src);
          xPos += 80;
        }
      }
      else{
        if (tileType === 4) {
          Crafty.e('Platform')
            .setImage('img/platform.png')
            .setPlatform(xPos, yPos, 1)
            .addCoins(Crafty.math.randomInt(2,4));
        }
        else if (tileType === 8) {
          Crafty.e('Platform')
            .setImage('img/platformx2.png')
            .setPlatform(xPos, yPos, 2)
            .addCoins(Crafty.math.randomInt(3,6));
        }
        xPos += 80;
      }
    });
  });
}
