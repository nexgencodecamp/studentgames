const PLATFORM_WIDTH = 160;
const PLATFORM_HEIGHT = 32;

/* Create and load assets */
var coinSprite = { 'sprites': { 'img/coinSprite.png': { tile: 30, tileh: 30, map: { coin_first: [0, 0], coin_last: [5, 0] } } } };
Crafty.load(coinSprite);

Crafty.c('Platform', {
  // These components will be added to any entity with the "Square" component before it is initialized
  required: '2D, DOM, Image, Collision',
  init: function () {
    this.w = 0;
    this.h = 0;
    this.x = 0;
    this.y = 0;
    this.scaleWidth = 1;
  },
  setPlatform: function (start_x, start_y, end_x, end_y) {
    this.x = start_x*TILE_WIDTH;
    this.y = start_y*TILE_HEIGHT;
    this.z = 9;
    this.attr({ x: this.x, y: this.y, w: (end_x-start_x)*TILE_WIDTH, h: (end_y-start_y)*TILE_HEIGHT });
    this._addGravityCushion();
    return this;
  },
  setImage: function (img) {
    this.image(Crafty.assets[img].src);
    return this;
  },
  addCoins: function (shouldAddCoins) {
    var numCoins = 0;
    for (var i = 0; i < (end_x-start_x)/TILE_WIDTH; i++) {
      if( Crafty.math.randomInt(1, 4) === 1 ){
        Crafty.e('2D, DOM, coin_first, SpriteAnimation, Collision')
          .attr({x: this.x + (i * TILE_WIDTH) - 1, y: this.y - 80, z: 10})
          .reel('spin', 300, [[0, 0], [1, 0], [2, 0], [3, 0], [4, 0], [5, 0]])
          .animate('spin', -1)
          .onHit('Player', function(){
            Crafty.audio.play('coin',1,1);
            updateScore(1);
            //console.log('numCoinsToCollect=', __STATE.numCoinsToCollect);
            __STATE.numCoinsToCollect--;
            if(__STATE.numCoinsToCollect === 0){
              Crafty.trigger(EVENT_LEVEL_COMPLETE);
            }
            this.destroy();
          })
        /* Add a coin to the total */
        numCoins++;
      }
    }
    __STATE.numCoinsToCollect += numCoins;
  },

  /* Private methods */
  _addGravityCushion: function () {
    Crafty.e('PlatformCushion, FloorTile, 2D, DOM, Color')
      .attr({x: this.x + 20, y: this.y - 1, w: this.w - 40, h: 1})
      .color('#3BB9FF');
  }
});
