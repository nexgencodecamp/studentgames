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

const PLAYER_SPEED = 4;
const WALKER_VELOCITY = -80;
const EVENT_PLAYER_DIE = "EVENT_PLAYER_DIE";
const EVENT_PLAYER_HIT_WALKER = "EVENT_PLAYER_HIT_WALKER";
const EVENT_PLAYER_HIT_WALL = "EVENT_PLAYER_HIT_WALL";
const EVENT_GAME_OVER = "EVENT_GAME_OVER";

const SCREENWIDTH = 800;
const SCREENHEIGHT = 600;
const TILE_WIDTH = 80;
const TILE_HEIGHT = 60;
const GRAVITY_STRENGTH = 10000;
const RIGHT = 0;
const LEFT = 1;
const NONE = 2;

var _player = null;

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
setupGlobalBindings();

var assets = {'tiles': ['img/tile-1.png', 'img/platform.png', 'img/platformx2.png']};
var playerSprite = { 'sprites': { 'img/playerSprite.png': { tile: 50, tileh: 77, map: { man_left: [0, 1], man_right: [0, 2], jump_right: [6, 4] } } } };

initialiseGame();

function initialiseGame () {
  Crafty.load(assets, function(){
    reset();
    loadBackground();
    loadSprites();
    generateMap();
    spawnEntities();
    displayText();
    /* Load sounds */
    Crafty.audio.add("coin", "sounds/coin.wav");
    __STATE.gameStarted = true;
  });
}

function loadBackground () {
  Crafty.background('#3BB9FF');
  //Crafty.background('#FFFFFF url(img/bg.png) repeat-x center center');
}

function loadSprites () {
  Crafty.load(playerSprite);
}

function spawnEntities () {
  spawnPlayer();
}

function spawnPlayer (){
  _player = Crafty.e('Player, 2D, DOM, man_right, SpriteAnimation, Twoway, Collision, Gravity, Tween, Keyboard')
    .attr({
      x: 50,
      y: 263
    })
    .reel('moveRight', 500, [[0, 2], [1, 2], [2, 2], [3, 2], [4, 2], [5, 2], [6, 2], [7, 2]])
    .reel('moveLeft', 500, [[0, 1], [1, 1], [2, 1], [3, 1], [4, 1], [5, 1], [6, 1], [7, 1]])
    .twoway(200, 510)
    .gravity('FloorTile')
    .gravityConst(GRAVITY_STRENGTH)
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
            .addCoins(Crafty.math.randomInt(1,2));
        }
        else if (tileType === 8) {
          Crafty.e('Platform')
            .setImage('img/platformx2.png')
            .setPlatform(xPos, yPos, 2)
            .addCoins(Crafty.math.randomInt(1,2));
        }
        xPos += 80;
      }
    });
  });
}

function displayText () {
  displayScore();
  displayTimeLeft();
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

Crafty.bind('EnterFrame', function(){
  if(__STATE.gameStarted === false)
    return;

  if(Crafty.frame() % 50 === 1){
    __STATE.timeLeft = _secondsTotal - Math.round(((new Date()).getTime() - _gameStartTime) / 1000);
    displayTimeLeft();
  }
  if(__STATE.gameOver && !__STATE.gameOverIsDisplaying){
    /* Display Game Over */
    Crafty.trigger(EVENT_GAME_OVER);
    __STATE.gameOverIsDisplaying = true;
  }
})
