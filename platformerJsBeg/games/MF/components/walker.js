// Define a sprite-map component
var walkerSprite = { 'sprites': { 'img/walkerSprite.png': { tile: 32, tileh: 32, map: { walker_first: [0, 0] } } } };
Crafty.load(walkerSprite);

Crafty.c('Walker', {
  // These components will be added to any entity with the "Square" component before it is initialized
  required: '2D, DOM, walker_first, SpriteAnimation, Gravity, Collision, Motion, Tween',
  init: function (obj) {
    this.z = 8;
    var entryPos = Crafty.math.randomInt(1,3);
    var direction = 0;
    var move = 0;
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
    this.reel('walkLeft', 500, [[1, 0], [3, 0], [5, 0], [7, 0]]);
    this.reel('walkRight', 500, [[1, 0], [2, 0], [4, 0], [6, 0]]);
    this.reel('walkFall', 500, [[6, 0]]);
    this.reel('die', 1000, [[8, 0], [9, 0], [10, 0]]);
    this.reel('still', 100, [[0, 0]]);

    setInterval(function(){
      move = Crafty.math.randomInt(1,5);
      if (this.x > _player.x + 100){
        direction = 0;
      }
      else if(this.x < _player.x - 100){
        direction = 1;
      }
      else {
        direction = Crafty.math.randomInt(0,1);
      }
      if (direction === 1 && move < 3){
        this.animate('walkLeft', -1);
        this.tween({y: this.y - 50}, 500);
        this.velocity().x = -WALKER_VELOCITY;
      }
      else if(direction === 0 && move < 3) {
        this.animate('walkRight', -1);
        this.tween({y: this.y - 50}, 500);
        this.velocity().x = WALKER_VELOCITY;
      }
      else {
        this.animate('still', -1);
        this.velocity().x = 0;
      }
    }.bind(this), 500);

    if(entryPos === 1){
        //this.animate('walkLeft', -1);
        //this.velocity().x = WALKER_VELOCITY;
        this.gravity('FloorTile');
    }
    else if(entryPos === 3){
        //this.animate('walkLeft', -1);
        this.gravity('FloorTile');
        //this.velocity().y = +WALKER_VELOCITY;
    }
    else if(entryPos === 2){
        /* Find a drop point */
        var lowX = Crafty.viewport._width + Crafty.viewport._x;
        var highX = Crafty.viewport._width + Crafty.viewport._x + 800;
        var dropX = Crafty.math.randomInt(lowX, highX);

        /* Walk towards the player */
        /*if(dropX > _player.x){
          this.animate('walkFall', -1);
          this.velocity().x = -WALKER_VELOCITY;*/
          this.gravity('FloorTile');
        /*}
        else{
          this.animate('walkFall', -1);
          this.velocity().x = WALKER_VELOCITY;
        }*/
    }


    //this.gravity('FloorTile');
    //this.bind('LandedOnGround', function() {




      /*if(entryPos === 3){
        this.animate('walkLeft', -1);
        this.tween({y: this.y - 50}, 500);
      }
      else{
        this.animate('walkRight', -1);
        this.tween({y: this.y - 50}, 500);
      }*/
    //});
    this.onHit('Player', function(hitData) {
      var playerObj = hitData[0].obj;
      if(playerObj.isJumping  || playerObj.isFalling){
        //if(this.velocity().x !== 0){
        Crafty.audio.add("walkerdown", "walker.wav");
        Crafty.audio.play("walkerdown");
          pauseAndResetAnimation(this);
          //var replacementReel = this.getReel().id.replace ('walk', 'die');
          this.animate('die', -1);
          //this.animate(replacementReel, 1);\

          this.velocity().x = 0;
          this.tween({alpha: 0}, 1000);
          this.bind('TweenEnd', function(){
            this.destroy();
          })
          Crafty.trigger(EVENT_PLAYER_HIT_WALKER);
      //  }
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
}
);
