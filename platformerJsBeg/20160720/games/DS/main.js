/* GLOBAL STATE VARIABLES START WITH A __ */
var _player = null;
var _viewportX = 0;
var _scoreDisplay = "";
var _gameStartTime = (new Date()).getTime();
var _timeLeftDisplay = "";
var _secondsTotal = 120;

/* State */
var __STATE = {};
__STATE.level = 1;
__STATE.gameStarted = false;
__STATE.gameOver = false;
__STATE.timeLeft = _secondsTotal;
__STATE.currentScore = 0;
__STATE.gameOverIsDisplaying = false;
__STATE.numCoinsToCollect = -1;

const SCENE_LOADING = 'scene_loading';
const SCENE_MAIN = 'scene_main';
const TILE_WIDTH = 80;
const TILE_HEIGHT = 60;
const PLATFORM_WIDTH = 160;
const PLATFORM_HEIGHT = 32;
const RIGHT = 0;
const LEFT = 1;
const NONE = 2;
const PLAYER_SPEED = 4;
const SCREENWIDTH = 800;
const SCREENHEIGHT = 600;
const BLOCK_VELOCITY = 120;
const WALKER_VELOCITY = -80;
const EVENT_PLAYER_DIE = "EVENT_PLAYER_DIE";
const EVENT_PLAYER_HIT_WALKER = "EVENT_PLAYER_HIT_WALKER";
const EVENT_PLAYER_HIT_WALL = "EVENT_PLAYER_HIT_WALL";
const EVENT_GAME_OVER = "EVENT_GAME_OVER";
const GRAVITY_STRENGTH = 1000;

Crafty.init(800, 600, document.getElementById('gamecanvas'));
setupGlobalBindings();

/* Create assets */
var playerSprite = { 'sprites': { 'img/playerSprite.png': { tile: 50, tileh: 77, map: { man_left: [0, 1], man_right: [0, 2], jump_right: [6, 4] } } } };
var coinSprite = { 'sprites': { 'img/coinSprite.png': { tile: 30, tileh: 30, map: { coin_first: [0, 0], coin_last: [5, 0] } } } };
var walkerSprite = { 'sprites': { 'img/walkerSprite2.png': { tile: 38, tileh: 36, map: { walker_first: [0, 0], walker_last: [2, 0] } } } };
var bombSprite = { 'sprites': { 'img/bombSprite.png': { tile: 32, tileh: 32, map: { bomb_first: [0, 0] } } } };
var assets = {
  'images': ['img/splash_author.png', 'img/splash.jpg'],
  'tiles': ['img/tile-1.png', 'img/tile-2.png', 'img/tile-3.png', 'img/platform.png', 'img/platformx2.png']
};

/* Load sounds */
Crafty.audio.add("coin", "sounds/coin.wav");


var tileMap = [
  [-1,8,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,4,-1,-1,-1,-1,-1,-1,-1,-1,8,-1,-1,-1,-1,-1,4,-1,-1,-1,-1,-1,-1,-1,8,-1,-1,-1,-1,-1,-1,8,-1,-1],
  [-1,-1,-1,-1,-1,-1,-1,-1,4,-1,-1,-1,4,-1,-1,-1,-1,-1,-1,8,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
  [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,4,-1,-1,-1,4,-1,-1,-1,-1,-1,-1,8,-1,-1,-1,-1],
  [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,4,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,4,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,4,-1,-1,-1,-1,-1,-1],
  [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,8,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,8,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
  [-1,-1,-1,-1,-1,-1,-1,-1,-1,4,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
  [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
];

const Y_OFFSET = 600 - (tileMap.length * TILE_HEIGHT);

Crafty.scene(SCENE_LOADING, function () {
  Crafty.e('2D, DOM, Image')
    .attr({ alpha: 1 })
    .image(Crafty.assets['img/splash_author.png'].src);

  Crafty.e('Delay').delay(function () {
    fadeInImage(Crafty.assets['img/splash.jpg'], playMainScene);
  }, 500, 0);
});

Crafty.scene(SCENE_MAIN, function () {
  initialiseGame(1);
});

/* Kick everything off! */
runScenes();

function reset () {
  _player = null;
  _viewportX = 0;
  _scoreDisplay = "";
  _gameStartTime = (new Date()).getTime();
  _timeLeftDisplay = "";
  _secondsTotal = 120;

  __STATE.gameStarted = false;
  __STATE.gameOver = false;
  __STATE.timeLeft = _secondsTotal;
  __STATE.currentScore = 0;
  __STATE.gameOverIsDisplaying = false;
  __STATE.numCoinsToCollect = -1;

  /* Position viewport */
  Crafty.viewport.scroll('_x', 0)
}

function initialiseGame(level){
  // if(level > 2){
  //   displayEndOfGame();
  //   return;
  // }
  reset();
  loadBackground();
  loadResources();
  generateMap();
  spawnEntities();
  displayText();
  __STATE.gameStarted = true;
}

function startNextLevel () {
  Crafty("*").destroy();
  initialiseGame(++__STATE.level);
}

function loadBackground () {
  Crafty.background('#3BB9FF');
  
}

function loadResources () {
  Crafty.load(coinSprite);
  Crafty.load(playerSprite);
  Crafty.load(walkerSprite);
  //Crafty.load(bombSprite);
  //Crafty.load(blockSprite);
}

function spawnEntities () {
  spawnPlayer();
  spawnWalkers();
}

function displayText () {
  displayScore();
  displayTimeLeft();
}

function loadEnemies () {
  Crafty.e('2D, DOM, Color, SpriteAnimation, Collision, Motion')
    .attr({ x: 720, y: 390, w: 30, h: 30 })
    .color('#A4ED69')
    .onHit('Player', function(){
      /* Stop the block in its tracks */
      this.velocity().x = 0;
      /* Player death sequence */
      Crafty.trigger(EVENT_PLAYER_DIE);
    })
    .bind('EnterFrame', function(){
      if(this.x >= 850 && this.velocity().x === BLOCK_VELOCITY){
        this.velocity().x = -BLOCK_VELOCITY;
      }
      else if(this.x <= 720 && this.velocity().x === -BLOCK_VELOCITY){
        this.velocity().x = BLOCK_VELOCITY;
      }
    })
    .velocity().x = BLOCK_VELOCITY;
}

function generateMap () {
  tileMap.map(function (tileRow, rowIdx) {
    tileRow.map(function (tile, tileIdx) {
      //console.log('tile:',tile,'tileIdx:',tileIdx);
      var xPos = tileIdx * 80;
      var yPos = Y_OFFSET + (rowIdx * 60);
      if (tile !== -1 && tile < 3) {
        Crafty.e('FloorTile, 2D, DOM, Image, Collision')
          .attr({ x: xPos, y: yPos, w: TILE_WIDTH, h: TILE_HEIGHT
          })
          .image(Crafty.assets['img/tile-' + tile + '.png'].src);
      }
      else if (tile === 4) {
        var t = Crafty.e('Platform', {w: 160}).setImage('platform');
        t.position.x = xPos;
        t.position.y = yPos;
        t.placePlatform(1);
        t.addCoins(Crafty.math.randomInt(1,2));
      }
      else if (tile === 8) {
        var t = Crafty.e('Platform', {w: 320}).setImage('platformx2');
        t.position.x = xPos;
        t.position.y = yPos;
        t.placePlatform(2);
        t.addCoins(Crafty.math.randomInt(1,2));
      }
    });
  });
}

Crafty.bind('EnterFrame', function(){
  if(__STATE.gameStarted === false)
    return;

  if(Crafty.frame() % 50 === 1){
    __STATE.timeLeft = _secondsTotal - Math.round(((new Date()).getTime() - _gameStartTime) / 1000);
    // if(__STATE.timeLeft <= 0){
    //   __STATE.timeLeft = 0;
    //   __STATE.gameOver = true;
    //   __STATE.gameStarted = false;
    // }
    displayTimeLeft();
  }
  if(__STATE.gameOver && !__STATE.gameOverIsDisplaying){
    /* Display Game Over */
    Crafty.trigger(EVENT_GAME_OVER);
    __STATE.gameOverIsDisplaying = true;
  }
  if(__STATE.numCoinsToCollect === -1){
    // displayLevelComplete();
    // Crafty("Delay").delay(startNextLevel, 3000, 1);
    // __STATE.numCoinsToCollect = -2;
  }
})

function spawnPlayer () {
  _player = Crafty.e('Player, 2D, DOM, man_right, SpriteAnimation, Twoway, Collision, Gravity, Tween, Keyboard')
    .attr({
      x: 50,
      y: 263
    })
    .reel('moveRight', 500, [[0, 2], [1, 2], [2, 2], [3, 2], [4, 2], [5, 2], [6, 2], [7, 2]])
    .reel('moveLeft', 500, [[0, 1], [1, 1], [2, 1], [3, 1], [4, 1], [5, 1], [6, 1], [7, 1]])
    .reel('jumpRight', 200, [[5, 4], [6, 4]])
    .reel('jumpLeft', 200, [[3, 4], [2, 4]])
    .twoway(200, 510)
    .gravity('FloorTile')
    .gravityConst(GRAVITY_STRENGTH)
    .bind('Moved', function (obj) {
      if (this.x >= (SCREENWIDTH / 2) && this.x <= 3440) {
        Crafty.viewport.scroll('_x', (this.x - (SCREENWIDTH / 2)) * -1);
        displayScore();
        displayTimeLeft();
      }
    })
    .bind('CheckJumping', function (ground) {
      this.isJumping = true;
      var  canJump, doubleJump;
      if(this.canJump === false && !this.inDoubleJumpMode){
        /* Lets check if there is a platform above us */
        var platforms = Crafty('Tile');
        for(var i=0; i < platforms.length; i++){
          var platform = platforms[i];
          platform = Crafty(platform);
          if(platform.x < this.x && platform.y < this.y && platform.x+160 > this.x){
            /* We probably have a platform above us so don't allow double jump */
            canJump = false;
            doubleJump = false;
            break;
          }
        }
        this.canJump = canJump !== undefined ? canJump : true;
        this.inDoubleJumpMode = doubleJump !== undefined ? doubleJump : true;
      }
      else if(this.inDoubleJumpMode){
        this.canJump = false;
      }
      this.pauseAnimation();
      this.resetAnimation();
      this.sprite(this.currentDirection === RIGHT ? 6 : 2, 4);
    })
    .bind('LandedOnGround', function (ground) {
      if (this.isJumping) {
        this.isJumping = false;
        this.gravityConst(GRAVITY_STRENGTH);
        /* We cannot get the direction from the velocity. We'll use the current loaded sprite animation  */
        this.sprite(0, this.getReel().id === 'moveRight' ? 2 : 1);
        /* We may need to enable controls here as we may have disabled them */
        if(this.bounced){
          this.velocity().x = 0;
          this.bounced = false;
        }
        this.inDoubleJumpMode = false;
      }
      /* Will need to enable controls in some circumstances */
      this.enableControl();
    })
    .bind('KeyDown',
      function (e) {
        if (Crafty.keydown['37'] && Crafty.keydown['39']) {
          this.pauseAnimation();
          this.resetAnimation();
          this.isMoving = false;
          return;
        }
        if (e.key === Crafty.keys.RIGHT_ARROW && !this.isJumping) {
          this.animate('moveRight', -1);
        }
        else if (e.key === Crafty.keys.LEFT_ARROW && !this.isJumping) {
          this.animate('moveLeft', -1);
        }
        this.isMoving = true;
      }
  )
    .bind('KeyUp',
      function (e) {
        if ((this.isPlaying('moveRight') && e.key === Crafty.keys.RIGHT_ARROW) ||
          (this.isPlaying('moveLeft') && e.key === Crafty.keys.LEFT_ARROW)) {
          this.pauseAnimation();
          this.resetAnimation();
          /* Check/Set the player's moving state */
          if (e.key === Crafty.keys.RIGHT_ARROW || e.key === Crafty.keys.LEFT_ARROW) {
            this.isMoving = false;
            return;
          }
        }
        /* Kickstart animation if we need to */
        if (this.isDown('RIGHT_ARROW') && !this.isJumping) {
          this.animate('moveRight', -1);
          this.isMoving = true;
        }
        else if (this.isDown('LEFT_ARROW') && !this.isJumping) {
          this.animate('moveLeft', -1);
          this.isMoving = true;
        }
      }
    )
    .bind('TweenEnd', function(prop){
      if(this.alpha === 0.0){
        this.destroy();
      }
    })
    .bind(EVENT_PLAYER_DIE, function () {
      this.tween({ alpha: 0.0 }, 1000);
      Crafty.trigger(EVENT_GAME_OVER);
    })
    .bind(EVENT_PLAYER_HIT_WALKER, function () {
      this.vy = -400;
      this.tween({ y: this.y - 100 }, 300);
    })
    .checkHits('Platform')
    .bind('HitOn', function(hitData){
      console.log('Hit Platform:', 'x:', hitData[0].obj.x, 'y:', hitData[0].obj.y, 'PlayerX:', this.x, 'PlayerY:', this.y);
      /* If underneath player, bounce back down */
      this.disableControl();
      this.gravityConst(1000);
      this.velocity().x = 0;
      this.velocity().y = 0;
      Crafty("Delay").delay(reinstateMovement, 500, 1);
    })
    .bind('NewDirection', function (obj) {
      /* 0 is neither right nor left so we don't care about it */
      if (obj.x === 0) return;
      this.currentDirection = obj.x === 1 ? RIGHT : LEFT;
      if (this.currentDirection === RIGHT && !this.isJumping) {
        if (this.isMoving) {
          /* Start running again */
          this.animate('moveRight', -1);
        }else {
          this.sprite(0, 2);
        }
      }
      else if (this.currentDirection === LEFT && !this.isJumping) {
        if (this.isMoving) {
          /* Start running again */
          this.animate('moveLeft', -1);
        }else {
          this.sprite(0, 1);
        }
      }
    })
    .bind('EnterFrame', function(){
      if(this.x <= -6) this.x = -5;
      if(this.x >= 3785) this.x = 3784;
    })

  /* Set player defaults */
  _player.isJumping = false;
  _player.currentDirection = RIGHT;
  _player.isMoving = false;
  _player.reel('moveRight');
  _player.bounced = false;
  _player.inDoubleJumpMode = false;
}

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

function spawnBombs () {
  Crafty.e('Delay').delay(spawnBomb, 1000, -1);
}

function spawnBomb () {
  Crafty.e('2D, DOM, bomb_first, Collision, AngularMotion, Gravity')
    .attr({ x: Crafty.math.randomInt(10, 760), y: -33 })
    .gravity('FloorTile')
    .gravityConst(200)
    .onHit('FloorTile', function(hitData){
      this.destroy();
    })
    .bind('LandedOnGround', function(obj){
        this.destroy();
    })
}

function runScenes () {
  Crafty.load(assets, function () {
    Crafty.scene(SCENE_LOADING);
  });
}

function playMainScene () {
  Crafty.scene(SCENE_MAIN);
}

function fadeInImage (img, cb) {
  Crafty.e('2D, DOM, Image, Tween')
    .attr({ alpha: 0 })
    .tween({ alpha: 1.0 }, 1000)
    .bind('TweenEnd', function () {
      cb();
    })
    .image(img.src);
}

function displayTimeLeft () {
  if(_timeLeftDisplay){
    _timeLeftDisplay.destroy();
  }
  _timeLeftDisplay = Crafty.e("2D, DOM, Text")
    .attr({ x: 720 - Crafty.viewport._x, y: 20 })
    .text(__STATE.timeLeft)
    .textColor('#FF0000')
    .textFont({ size: '14px', weight: 'bold', family: 'Courier New' });
}

function displayScore () {
  if(_scoreDisplay){
    _scoreDisplay.destroy();
  }
  _scoreDisplay = Crafty.e("2D, DOM, Text")
    .attr({ x: 750 - Crafty.viewport._x, y: 20 })
    .text(pad(__STATE.currentScore, 3))
    .textColor('#FF0000')
    .textFont({ size: '14px', weight: 'bold', family: 'Courier New' });
}

function displayGameOver(){
  if(Crafty("GameOver"))
    Crafty("GameOver").destroy();

  Crafty.e("GameOver, 2D, DOM, Text")
    .attr({ x: 280 - Crafty.viewport._x, y: 280, z:100, w: 250 })
    .text("GAME OVER").textColor('#FF0000').textFont({ size: '36px', weight: 'bold', family: 'Courier New' });
}

function displayLevelComplete(){
  if(Crafty("LevelComplete"))
    Crafty("LevelComplete").destroy();

  Crafty.e("LevelComplete, 2D, DOM, Text")
    .attr({ x: 270 - Crafty.viewport._x, y: 280, z:100, w: 350 })
    .text("LEVEL COMPLETE").textColor('#33FF33').textFont({ size: '36px', weight: 'bold', family: 'Courier New' });
}

function updateScore(amt){
  __STATE.currentScore += amt;
  displayScore();
}

function pad(num, size) {
    var s = num+"";
    while (s.length < size) s = "0" + s;
    return s;
}

function setupGlobalBindings () {
  Crafty.bind(EVENT_GAME_OVER, function(){
    _player.disableControl();
    pauseAndResetAnimation(_player);
    displayGameOver();
  })
}

function pauseAndResetAnimation (ent){
  ent.pauseAnimation();
  ent.resetAnimation();
}

function reinstateMovement () {
  _player.enableControl();
}
