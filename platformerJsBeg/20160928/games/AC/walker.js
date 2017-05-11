// Define a sprite-map component
var walkerSprite = { 'sprites': { 'img/walkerSprite.png': { tile: 40, tileh: 52, map: { walker_first: [0, 0] } } } };
Crafty.load(walkerSprite);

Crafty.c('Walker', {
  // These components will be added to any entity with the "Square" component before it is initialized
  required: '2D, DOM, walker_first, SpriteAnimation, Gravity, Collision, Motion, Tween',
  init: function (obj) {
    this.z = 8;
    var entryPos = Crafty.math.randomInt(1,3);
    if(entryPos === 1){
        this.x = Crafty.viewport._width - Crafty.viewport._x;
        this.y = 504;
    }
    if(entryPos === 2){
        this.x = Crafty.viewport._width - Crafty.viewport._x;
        this.y = -50;
    }
    if(entryPos === 3){
        this.x = -Crafty.viewport._x - 40;
        this.y = 504;
    }
    this.reel('walkLeft', 600, [[1, 0], [4, 0]]);
    this.reel('walkRight', 600, [[20, 0], [21, 0]]);
    this.reel('walkFall', 600, [[1, 0], [4, 0]]);
    this.reel('dieLeft', 75, [[6, 0],[7,0],[8,0],[9,0],[10,0],[11,0],[12,0],[13,0],[14,0],[15,0],[16,0],[17,0],[18,0],[19,0]]);
    this.reel('dieRight', 75, [[6, 0],[7,0],[8,0],[9,0],[10,0],[11,0],[12,0],[13,0],[14,0],[15,0],[16,0],[17,0],[18,0],[19,0]]);
    this.reel('dieFall', 75, [[6, 0],[7,0],[8,0],[9,0],[10,0],[11,0],[12,0],[13,0],[14,0],[15,0],[16,0],[17,0],[18,0],[19,0]]);
    if(entryPos === 1){
        this.animate('walkLeft', -1);
        this.velocity(1.5).x = WALKER_VELOCITY;
        this.tween({y: this.y -50}, 500);
    }
    else if(entryPos === 2){
        /* Find a drop point */
        var lowX = Crafty.viewport._width + Crafty.viewport._x;
        var highX = Crafty.viewport._width + Crafty.viewport._x + 800;
        var dropX = Crafty.math.randomInt(lowX, highX);

        /* Walk towards the player */
        if(dropX > _player.x){
          this.animate('walkFall', -1);
          this.velocity(1.5).x = -WALKER_VELOCITY;
          this.tween({y: this.y -50}, 500);
        }
        else{
          this.animate('walkFall', -1);
          this.velocity(1.5).x = WALKER_VELOCITY;
          this.tween({y: this.y -50}, 500);
        }
    }
    else if(entryPos === 3){
        this.animate('walkRight', -1);
        this.velocity(1.5).x = -WALKER_VELOCITY;
        this.tween({y: this.y -50}, 500);
    }
    this.gravity('FloorTile');
    this.onHit('Player', function(hitData) {
      var playerObj = hitData[0].obj;
      if(playerObj.isJumping){
        /*
        if(this.velocity().x !== 0){
          pauseAndResetAnimation(this);
          var replacementReel = this.getReel().id.replace ('walk', 'die');
          this.animate(replacementReel, 1);
          this.velocity().x = 0;
          this.tween({alpha: 0}, 750);
          this.bind('TweenEnd', function(){
            this.destroy();
          })
          Crafty.trigger(EVENT_PLAYER_HIT_WALKER);
        }*/
      }
      else{
        /* We need to check this is a genuine collision */
        if(this.getReel().id.match(/dieLeft|dieRight|dieFall/) !== null) return;
        this.velocity().x = 0;
        //this.x += 5;
        pauseAndResetAnimation(this);
        this.reelPosition(1);
        Crafty.trigger(EVENT_PLAYER_DIE);
      }
    });
    this.bind('EnterFrame', function(){
      if(this.y > 700){
        this.destroy();
      }
    })
  }
});
