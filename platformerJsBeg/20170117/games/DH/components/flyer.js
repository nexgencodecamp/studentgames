// Define a sprite-map component
var flyerSprite = { 'sprites': { 'img/flyerSprite.png': { tile: 41, tileh: 38, map: { flyer_first: [0, 0] } } } };
Crafty.load(flyerSprite);

function spawnFlyer(){
  return Crafty.e('Flyer, 2D, DOM, flyer_first, SpriteAnimation, Collision, Motion, Tween')
    .attr({
      x: Crafty.viewport._width - Crafty.viewport._x ,
      y: Crafty.math.randomInt(0,9) * TILE_HEIGHT ,
      z: 8
    });
    attr({
      x: Crafty.viewport._width - Crafty.viewport._x ,
      y: Crafty.math.randomInt(0,9) * TILE_HEIGHT ,
      z: 8
    });
      attr({
        x: Crafty.viewport._width - Crafty.viewport._x ,
        y: Crafty.math.randomInt(0,9) * TILE_HEIGHT ,
        z: 8
    });
    .reel('flyLeft', 600, [[0, 0], [1, 0], [2, 0]]);
    .reel('dieLeft', 100, [[3, 0]]);

    .checkHits('Platform')
    .bind('HitOn', function(hitData){
      this.destroy();
    })


    .onHit('Player', function(hitData) {
      this.velocity().x = 0;
      //this.x += 5;
      pauseAndResetAnimation(this);
      this.reelPosition(1);
      this.destroy();
      Crafty.trigger(EVENT_PLAYER_HIT_WALKER);
    })

    .bind('EnterFrame', function(){
      this.x -= 2;
      if(this.y > 700){
        this.destroy();
      }
    });
}
