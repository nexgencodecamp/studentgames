const SCREENWIDTH = 800;
const SCREENHEIGHT = 600;
const TILE_WIDTH = 80;
const TILE_HEIGHT = 60;
const GRAVITY_STRENGTH = 1000;
const RIGHT = 0;
const LEFT = 1;
const NONE = 2;

var _player = (playerSprite);

var tileMap = [
  [[1],8,[13],4,[8],8,[5],4,[7],8,[6],8,[2]],
  [[8],4,[3],4,[6],8,[28]],
  [[8],[24],4,[3],4,[6],8,[4]],
  [[8],[3],4,[15],4,[13],4,[6]],
  [[8],[8],8,[19],8,[11]],
  [[8],[1],4,[38]],
  [[8],[39]],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
];

Crafty.init(800, 600, document.getElementById('gamecanvas'));

var assets = {'tiles': ['img/tile-1.png', 'img/platform.png', 'img/platformx2.png']};
var playerSprite = { 'sprites': { 'img/playerSprite.png': { tile: 51, tileh: 60, map: { man_left: [1, 0], man_right: [8, 0], jump_right: [6, 4] } } } };

initialiseGame();

function initialiseGame () {
  Crafty.load(assets, function(){
    loadBackground();
    loadSprites();
    generateMap();
    spawnEntities();
  });
}

function loadBackground () {
  Crafty.background('#ca198f');
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
    .reel('moveRight', 500, [[0, 0], [1, 0], [2, 0], [3, 0], [4, 0], [5, 0], [6, 0], [7, 0], [8, 0], [9,0]])
    .reel('moveLeft', 500, [[0, 0], [1, 0], [2, 0], [3, 0], [4, 0], [5, 0], [6, 0], [7, 0], [8, 0], [9, 0]])
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
        //displayScore();
        //displayTimeLeft();
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
    });

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
      if (tile.constructor === Array){
        /* Advance the x-position by the number of 'blank tiles' */
        xPos += tile[0] * 80;
      }
      if (tile === 1) {
        Crafty.e('FloorTile, 2D, DOM, Image, Collision')
          .attr({ x: xPos, y: yPos, w: TILE_WIDTH, h: TILE_HEIGHT })
          .image(Crafty.assets['img/tile-' + tile + '.png'].src);
      }
      else if (tile === 4) {
        var t = Crafty.e('Platform', {w: 160}).setImage('img/platform.png');
        t.position.x = xPos;
        t.position.y = yPos;
        t.placePlatform(1);
        t.addCoins(Crafty.math.randomInt(1,2));
      }
      else if (tile === 8) {
        var t = Crafty.e('Platform', {w: 320}).setImage('img/platformx2.png');
        t.position.x = xPos;
        t.position.y = yPos;
        t.placePlatform(2);
        t.addCoins(Crafty.math.randomInt(1,2));
      }
      xPos += 80;
    });
  });
}
