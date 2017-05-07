var walkerSprite = { 'sprites': { 'img/walkerSprite2.png': { tile: 38, tileh: 36, map: { walker_first: [0, 0], walker_last: [2, 0] } } } };



function spawnWalkers () {
  Crafty.e('Delay').delay(spawnWalker, Crafty.math.randomInt(2000, 8000), -1);
}

function spawnWalker () {
  Crafty.e('Walker')
    .onHit('Player', function(hitData) {
      var playerObj = hitData[0].obj;
      if(playerObj.isJumping){
        if(this.velocity().x !== 0){
          pauseAndResetAnimation(this);
          this.animate('die', 1);
          this.velocity().x = 0;
          this.tween({alpha: 0}, 750);
          Crafty.trigger(EVENT_PLAYER_HIT_WALKER);
        }
      }
      else{
        /* We need to check this is a genuine collision */
        if(this.getReel().id === 'die') return;
        this.velocity().x = 0;
        this.x += 5;
        pauseAndResetAnimation(this);
        this.reelPosition(1);
        Crafty.trigger(EVENT_PLAYER_DIE);
      }
    });
}
