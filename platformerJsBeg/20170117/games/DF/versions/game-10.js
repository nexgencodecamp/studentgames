/*
  Title: game-10.js
  Description: In this version of the code,
               we are going to create a second level
*/

/* GLOBAL STATE VARIABLES START WITH A __ */
var _player = null;
var _viewportX = 0;
var _scoreDisplay = "";
var _gameStartTime = (new Date()).getTime();
//var _timeLeftDisplay = "";
//var _secondsTimeLimit = 1000;
//var _secondsTotal = _secondsTimeLimit;
Crafty.audio.add('backgroundMusic',"sounds/birdland.wav")
Crafty.audio.play('backgroundMusic', -1, 1)
var _tileMap = [
  {
    "level": 2,
    "map": [
      [[0,1],[0, 8],[0,13],[4,1],[8,1],[0,16], [2,1]],
      [[0,8],[0,4],[0,3],[0,4],[0,6],[0, 8],[0,11],[4,1],[0,8]],
      [[0,8],[0,19],[0,4],[0,3],[4,1],[0,6],[0, 8],[0,4]],
      [[0,11],[0,4],[4,1],[8,1],[0,4],[0,13],[0,1],[0,6]],
      [[0,8],[4, 1],[0,20],[8,1],[0, 6],[4,1],[0,6]],
      [[4,1],[0,9],[0,16],[4,1],[0,17]],
      [[0,48]],
      [[1,24], [0,12], [1,12]]
    ]
  },
  {
    "level": 1,
    "map": [
      [[0,4],[0,1],[0,12],[0,1],[0,8],[0,1],[0,5],[0,1],[0,5],[0,1]],
      [[0,8],[0,1],[0,3],[0,1],[0,6],[0,1],[0,23]],
      [[0,8],[0,19],[0,1],[0,3],[0,1],[0,6],[0,1],[0,4]],
      [[4,1],[0,7],[4,1],[0,8],[0,1],[8,1],[0,6]],
      [[0,16],[8,1],[0,13],[8,1],[0,11]],
      [[0,9],[0,37]],
      [[0,48]],
      [[1,48]]
    ]
  },
  {
    "level": 3,
    "map": [
      [[0,4],[0,1],[8,1],[0,1],[0,8],[0,1],[0,5],[0,1],[0,5],[0,1]],
      [[0,10],[4,1],[0,3],[0,10],[4,1],[0,1],[0,23]],
      [[4,1],[0,19],[0,1],[0,3],[0,1],[0,6],[0,1],[0,4]],
      [[0,4],[0,7],[0,1],[8,1],[1,3],[0,14],[0,6]],
      [[0,3],[0,4],[0,13],[8,1],[0,11]],
      [[1,3],[4,1],[4,37]],
      [[1,3]],
      [[1,3]]
    ]
  }
]


/* State */
var __STATE = {};
__STATE.level = 1;
__STATE.gameStarted = false;
__STATE.gameOver = false;
//__STATE.timeLeft = _secondsTotal;
__STATE.currentScore = 0;
__STATE.gameOverIsDisplaying = false;
__STATE.numCoinsToCollect = 0;
__STATE.levelComplete = false;
__STATE.soundtrackPlaying = false;

const PLAYER_SPEED = 4;
const WALKER_VELOCITY = -80;
const EVENT_PLAYER_DIE = "EVENT_PLAYER_DIE";
const EVENT_PLAYER_HIT_WALKER = "EVENT_PLAYER_HIT_WALKER";
const EVENT_PLAYER_HIT_WALL = "EVENT_PLAYER_HIT_WALL";
const EVENT_GAME_OVER = "EVENT_GAME_OVER";
const EVENT_LEVEL_COMPLETE = "EVENT_LEVEL_COMPLETE";
const SCREENWIDTH = 800;
const SCREENHEIGHT = 600;
const TILE_WIDTH = 80;
const TILE_HEIGHT = 60;
const GRAVITY_STRENGTH = 1000;
const RIGHT = 0;
const LEFT = 1;
const NONE = 2;

Crafty.init(800, 600, document.getElementById('gamecanvas'));

setupGlobalBindings();

var assets = {'tiles': ['img/tile-1.png', 'img/platform.png', 'img/platformx2.png', 'img/sun.png', 'img/goldenMo.png']};
var playerSprite = { 'sprites': { 'img/britishGuySpriteSheet.png': { tile: 55, tileh: 84, map: { man_left: [3, 1], man_right: [3, 0], jump_right: [1,3] } } } };

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
    Crafty.audio.add("jump", "sounds/jump.wav");
    Crafty.audio.add("victory", "sounds/victory.wav");

    __STATE.gameStarted = true;
  });
}

function loadBackground () {
  var bgColor = shade('#3BB9FF', __STATE.level * 4);
  //Crafty.background(bgColor);
  //Crafty.background('#FFFFFF url(img/bg.png) repeat-x center center');
  Crafty.e('BG, 2D, DOM, Image')
    .attr({ x: 0, y: 0, z: 0, w:3840, h:600 })
    .image('img/bg.png', 'repeat-x');

}

function shade(color, percent){
    if (color.length > 7 ) return shadeRGBColor(color,percent);
    else return shadeColor2(color,percent);
}

function shadeColor2(color, percent) {
    var f=parseInt(color.slice(1),16),t=percent<0?0:255,p=percent<0?percent*-1:percent,R=f>>16,G=f>>8&0x00FF,B=f&0x0000FF;
    return "#"+(0x1000000+(Math.round((t-R)*p)+R)*0x10000+(Math.round((t-G)*p)+G)*0x100+(Math.round((t-B)*p)+B)).toString(16).slice(1);
}

function loadSprites () {
  Crafty.load(playerSprite);
}

function spawnEntities () {
  spawnPlayer();
  spawnWalkers();
}

function spawnPlayer (){
  _player = Crafty.e('Player, 2D, DOM, man_right, SpriteAnimation, Twoway, Collision, Gravity, Tween, Keyboard')
    .attr({
      x: 50,
      y: 263
    })
    if(__STATE.level < 3){
      _player.reel('moveRight', 1000, [[0, 0], [1, 0], [2, 0], [3, 0], [4, 0], [3, 0], [2,0], [1, 0]])
      _player.reel('moveLeft', 1000, [[0, 1], [1, 1], [2, 1], [3, 1], [4, 1], [3, 1], [2, 1], [1, 1]])
      _player.reel('jump', 500, [[3,2],[2,2]])
    }else{
      _player.reel('moveRight', 1000, [[0, 3], [1, 3], [2, 3], [3, 3], [4, 3], [3, 3], [2,3], [1, 3]])
      _player.reel('moveLeft', 1000, [[0, 4], [1, 4], [2, 4], [3, 4], [4, 4], [3, 4], [2, 4], [1, 4]])
      _player.reel('jump', 500, [[3,5],[2,5]])
    }
    _player.twoway(200, 510)
    _player.gravity('FloorTile')
    _player.gravityConst(GRAVITY_STRENGTH)
    _player.bind('KeyDown',
      function (e) {
        if(__STATE.levelComplete)
          return;

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
        if(__STATE.levelComplete)
          return;

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
        //displayTimeLeft();
      }
    })
    .bind('CheckJumping', function (ground) {
      this.isJumping = true;
      Crafty.audio.play("jump", 1 , 0.1);
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
      //this.animate('jump', 1)
      this.animate('jump', 1);
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
      if(!__STATE.levelComplete){
        this.enableControl();
      }
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
    .checkHits('Platform')
    .bind('HitOn', function(hitData){
      /* If underneath player, bounce back down */
      this.disableControl();
      this.gravityConst(1000);
      this.velocity().x = 0;
      this.velocity().y = 0;
      Crafty.e("Delay").delay(reinstateMovement, 500, 1);
    })
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
    .bind(EVENT_LEVEL_COMPLETE, function () {
      this.disableControl();
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
  Crafty.e('Delay').delay(spawnWalker, Crafty.math.randomInt(2000 - __STATE.level * 100, 8000 - __STATE.level * 100), -1);
}

function spawnWalker () {
  Crafty.e('Walker');
}

/*
  The tilemap generation. Tile level maps are 'pulled' from the tilemap.json
  file which is in the 'runner' directory. You can add as many levels as you
  want.
*/
function generateMap () {
  _tileMap.map(function(lv, idx){
    if(lv.level === __STATE.level){
      var tempMap = lv.map;
      tempMap = lv.map;
      processMap(tempMap);
      return;
    }
  });
}

function processMap(tempMap){
  const Y_OFFSET = 600 - (tempMap.length * TILE_HEIGHT);
  tempMap.map(function (tileRow, rowIdx) {
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
      }else if (tileType === 2) {
        for(var i=0; i < tileNum; i++){
          Crafty.e('Floor2Tile, 2D, DOM, Image, Collision')
            .attr({ x: xPos, y: yPos, w: TILE_WIDTH, h: TILE_HEIGHT })
            .image('img/goldenMo.png');
          xPos += 80;
        }
      }
      else{
        if (tileType === 4) {
          Crafty.e('Platform')
            .setImage('img/platform.png')
            .setPlatform(xPos, yPos, 1)
            .addCoins(Crafty.math.randomInt(1,2));
            xPos += 160;
        }
        else if (tileType === 8) {
          Crafty.e('Platform')
            .setImage('img/platformx2.png')
            .setPlatform(xPos, yPos, 2)
            .addCoins(Crafty.math.randomInt(1,2));
          xPos += 320;
        }
      }
      if(rowIdx === 6) console.log('x:',xPos,'y:',yPos);
    });
  });
}

function displayText () {
  displayScore();
  //displayTimeLeft();
}

/*function displayTimeLeft () {
  if(_timeLeftDisplay){
    _timeLeftDisplay.destroy();
  }
  _timeLeftDisplay = Crafty.e("2D, DOM, Text")
    .attr({ x: 720 - Crafty.viewport._x, y: 20 })
    .text(__STATE.timeLeft)
    .textColor('#FF0000')
    .textFont({ size: '14px', weight: 'bold', family: 'Courier New' });
}*/

function displayScore () {
  if(_scoreDisplay){
    _scoreDisplay.destroy();
  }
  _scoreDisplay = Crafty.e("2D, DOM, Text")
    .attr({ x: 720 - Crafty.viewport._x, y: 20 })
    .text(pad(__STATE.currentScore, 3))
    .textColor('rgb(0,120,0)')
    .textFont({ size: '30px', weight: 'bold', family: 'Courier New' });

}

function displayGameOver(){
  if(Crafty("GameOver"))
    Crafty("GameOver").destroy();

  Crafty.e("GameOver, 2D, DOM, Text")
    .attr({ x: 300 - Crafty.viewport._x, y: 230, z:100, w: 300 })
    .text("WASTED").textColor('rgb(200,1,12)').textFont({ size: '60px', weight: 'bold', family: 'Impact' });
}

function displayGameComplete(){
  Crafty("2D").each(function(i) {
    this.destroy();
  });
    loadBackground();

  Crafty.e("GameComplete, 2D, DOM, Text")
    .attr({ x: 300 - Crafty.viewport._x, y: 230, z:100, w: 350 })
    .text("Victory!").textColor('#FFFF00').textFont({ size: '60px', weight: 'bold', family: 'Impact' });
  Crafty.audio.play('victory', 1, 1)
  Crafty.e("GameComplete, 2D, DOM, Text")
    .attr({ x: 200 - Crafty.viewport._x, y: 340, z:100, w: 390 })
    .text("Land of The Bird By Dan").textColor('#00BB00').textFont({ size: '30px', weight: 'bold', family: 'Comic Sans MS' });

}




/*function displayLevel2Complete(){

  Crafty.e("Level2Complete, 2D, DOM, Text")
    .attr({ x: 300 - Crafty.viewport._x, y: 230, z:100, w: 350 })
    .text("Victory!").textColor('#FFFF00').textFont({ size: '60px', weight: 'bold', family: 'Impact' });

}
*/



function displayLevelComplete(){

  if(Crafty("LevelComplete"))
    Crafty("LevelComplete").destroy();

  Crafty.e("LevelComplete, 2D, DOM, Text")
    .attr({ x: 270 - Crafty.viewport._x, y: 280, z:100, w: 350 })
    .text("LEVEL "+__STATE.level+" COMPLETE").textColor('#33FF33').textFont({ size: '36px', weight: 'bold', family: 'Courier New' });

    if(Crafty("LevelComplete"))
      Crafty("LevelComplete").destroy();

    Crafty.e("LevelComplete, 2D, DOM, Text")
      .attr({ x: 270 - Crafty.viewport._x, y: 280, z:100, w: 350 })
      .text("LEVEL "+__STATE.level+" COMPLETE").textColor('#33FF33').textFont({ size: '36px', weight: 'bold', family: 'Courier New' });

    if(__STATE.level === 2){
      Crafty.e("Level2Complete, 2D, DOM, Text")
        .attr({ x: 210 - Crafty.viewport._x, y: 350, z:100, w: 500 })
        .text("Gained The Golden Mo'").textColor('#EEEE00').textFont({ size: '36px', weight: 'bold', family: 'Courier New' });

    }
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
    _player.destroy();
    displayGameOver();
  })
}

function pauseAndResetAnimation (ent){
  ent.pauseAnimation();
  ent.resetAnimation();
}

function reinstateMovement () {
  console.log('Enabling controls...');
  if(!__STATE.levelComplete){
    _player.enableControl();
  }
}

function reset () {
  _player = null;
  _viewportX = 0;
  _scoreDisplay = __STATE.level === 1 ? "" : _scoreDisplay;
  _gameStartTime = (new Date()).getTime();
  _timeLeftDisplay = "";
  //_secondsTotal = _secondsTimeLimit - __STATE.level * 5;

  __STATE.gameStarted = false;
  __STATE.gameOver = false;
  //__STATE.timeLeft = _secondsTotal;
  __STATE.currentScore = __STATE.level === 1 ? 0 : __STATE.currentScore;
  __STATE.gameOverIsDisplaying = false;
  __STATE.numCoinsToCollect = 0;
  __STATE.levelComplete = false;

  /* Position viewport */
  Crafty.viewport.scroll('_x', 0)
}

Crafty.bind('EnterFrame', function(){
  if(!__STATE.gameStarted || __STATE.levelComplete)
    return;

  if(!__STATE.gameOver && _player.y >= SCREENHEIGHT ){
    console.log("You Dead!")
    __STATE.gameOver = true
  }


  if(Crafty.frame() % 50 === 1){
    __STATE.timeLeft = null;//_secondsTotal - Math.round(((new Date()).getTime() - _gameStartTime) / 1000);
    if(__STATE.timeLeft <= -1){
      __STATE.gameOver = true;
    }
  }
  if(__STATE.gameOver && !__STATE.gameOverIsDisplaying){
    /* Display Game Over */
    Crafty.trigger(EVENT_GAME_OVER);
    __STATE.gameOverIsDisplaying = true;
  }
  if(!__STATE.gameOver){
    //displayTimeLeft();
  }
})

Crafty.bind(EVENT_LEVEL_COMPLETE, function(){
  console.log('Level Complete...');
  __STATE.levelComplete = true;
  if(__STATE.level >= _tileMap.length){
    displayGameComplete();
    return;
  }else{
    displayLevelComplete();
  }
  Crafty.e("Delay").delay(function(){
    /* Destroy everything */
    Crafty("2D").each(function(i) {
      this.destroy();
    });
    ++__STATE.level;
    initialiseGame();
  }, 2000, 0);
})


if(__STATE.level > 2){
  man_left = [3, 4]
  man_left = [3, 6]
}
