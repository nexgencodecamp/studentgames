const PLATFORM_WIDTH = 160;
const PLATFORM_HEIGHT = 32;

/* Create and load assets */
var coinSprite = { 'sprites': { 'img/coin.png': { tile: 30, tileh: 30, map: { coin_first: [0, 0], coin_last: [4, 0] } } } };
Crafty.load(coinSprite);

Crafty.c('Platform', {
  // These components will be added to any entity with the "Square" component before it is initialized
  required: '2D, DOM, Image, Collision',
  init: function () {
    this.w = PLATFORM_WIDTH;
    this.h = PLATFORM_HEIGHT;

    this.position = {x: 0, y: 0};
    this.scaleWidth = 1;
  },
  placePlatform: function (scaleWidth) {
    this.scaleWidth = scaleWidth;
    this.attr({ x: this.position.x, y: this.position.y, w: this.w * scaleWidth, h: this.h });
    this._addGravityCushion();
    return this;
  },
  setImage: function (img) {
    this.image(Crafty.assets[img].src);
    return this;
  },
  addCoins: function (shouldAddCoins) {
    if (shouldAddCoins) {
      var numCoins = 0;
      for (var i = 0; i < Crafty.math.randomInt(1, 4 * this.scaleWidth); i++) {
        Crafty.e('2D, DOM, coin_first, SpriteAnimation, Collision')
          .attr({x: this.x + (i * 32) - 1, y: this.y - 80})
          .reel('spin', 300, [[0, 0], [1, 0], [2, 0], [3, 0] ])
          .animate('spin', -1)
          .onHit('Player', function(){
            Crafty.audio.play('coin',1,1);
            updateScore(1);
            __STATE.numCoinsToCollect--;
            this.destroy();
          })
        /* Add a coin to the total */
        numCoins++;
      }
      __STATE.numCoinsToCollect += numCoins;
    }
  },

  /* Private methods */
  _addGravityCushion: function () {
    Crafty.e('PlatformCushion, FloorTile, 2D, DOM, Color')
      .attr({x: this.position.x + 20, y: this.position.y - 1, w: this.w - 40, h: 1})
      .color('#3BB9FF');
  }
});
