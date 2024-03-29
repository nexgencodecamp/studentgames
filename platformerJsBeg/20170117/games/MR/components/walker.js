// Define a sprite-map component
var BaddieSpaceDrones = { 'sprites': { 'img/baddieSpaceProbes.png': { tile: 40, tileh: 28, map: { walker_first: [0, 0] } } } };
Crafty.load(BaddieSpaceDrones);

Crafty.c('Walker', {
  // These components will be added to any entity with the "Square" component before it is initialized
  required: '2D, DOM, walker_first, SpriteAnimation, Collision, Motion, Tween',
  init: function (obj) {
    this.z = 8;
    var entryPos = Crafty.math.randomInt(1,3);
    if(entryPos === 1){
        this.x = Crafty.viewport._width - Crafty.viewport._x;
        this.y = Crafty.math.randomInt(0, 600);
    }
    if(entryPos === 2){
        this.x = Crafty.viewport._width - Crafty.viewport._x;
        this.y = -50;
    }
    if(entryPos === 3){
        this.x = -Crafty.viewport._x - 40;
        this.y = 504;
    }
    this.reel('walkLeft', 600, [[0,0],[1,0],[2,0],[3,0]]);
    this.reel('walkRight', 600, [[0,1],[1,1],[2,1],[3,1]]);
    this.reel('dieLeft', 100, [[4,0]]);
    this.reel('dieRight', 100, [[4,1]]);
    if(entryPos === 1){
        this.animate('walkLeft', -1);
        this.velocity().x = WALKER_VELOCITY;
    }
    else if(entryPos === 2){
        /* Find a drop point */
        var lowX = Crafty.viewport._width + Crafty.viewport._x;
        var highX = Crafty.viewport._width + Crafty.viewport._x + 800;
        var dropX = Crafty.math.randomInt(lowX, highX);

        /* Walk towards the player */
        //if(dropX > _player.x){
        //  this.animate('walkFall', -1);
          //this.velocity().x = -WALKER_VELOCITY;
      //  }
      //  else{
          //this.animate('walkFall', -1);
          //this.velocity().x = WALKER_VELOCITY;
    //    }
  //  }
    //else if(entryPos === 3){
        this.animate('walkRight', -1);
        this.velocity().x = -WALKER_VELOCITY;
    }
    //this.gravity('FloorTile');
    this.onHit('Player', function(hitData) {
      var playerObj = hitData[0].obj;
      if(playerObj.isJumping){
        if(this.velocity().x !== 0){
          pauseAndResetAnimation(this);
          var replacementReel = this.getReel().id.replace ('walk', 'die');
          this.animate(replacementReel, 1);
          this.velocity().x = 0;
          this.tween({alpha: 0}, 750);
          this.bind('TweenEnd', function(){
            this.destroy();
          });
          Crafty.trigger(EVENT_PLAYER_HIT_WALKER);
        }
      }
      else{
        /* We need to check this is a genuine collision */
        if(this.getReel().id.match(/dieLeft|dieRight|dieFall/) !== null) return;
        this.velocity().x = 0;
        //this.x += 5;
        pauseAndResetAnimation(this);
        this.reelPosition(1);
        this.destroy();
        Crafty.trigger(EVENT_PLAYER_DIE);
      }
    });
    this.bind('EnterFrame', function(){
      if(this.y > 700){
        this.destroy();
      }
    });
  }
});
