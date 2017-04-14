// Initialise the size of the game
Crafty.init(800, 600, document.getElementById('game'));

// Set the background color
Crafty.background('rgb(0, 0, 0)');

// Create a paddle - then add color, position and movement
Crafty.e("Paddle, 2D, DOM, Color, Multiway")
    .color('rgb(255,255,255)')
    .attr({ x: 20, y: 250, w: 15, h: 100 })
    .multiway(200, { W: -90, S: 90 });
// Create another paddle but in a different position
Crafty.e("Paddle, 2D, DOM, Color, Multiway")
    .color('rgb(255,255,255)')
    .attr({ x: 735, y: 250, w: 15, h: 100 })
    .multiway(200, { UP_ARROW: -90, DOWN_ARROW: 90 });

//Create the ball with color, position and bound to the animation loop
Crafty.e("2D, DOM, Color, Collision")
    .color('rgb(255, 255, 255)')
    .attr({ x: 300, y: 250, w: 10, h: 10, dX: Crafty.math.randomInt(2, 5), dY: Crafty.math.randomInt(2, 5) })
    .bind('EnterFrame', function () {
        //hit floor or roof
        if (this.y <= 0 || this.y >= 590)
            this.dY *= -1;

        // hit left or right boundary
        if (this.x > 800) {
            this.x = 400;
            Crafty("LeftPoints").each(function () {
                this.text(++this.points) });
        }
        if (this.x < -10) {
            this.x = 400;
            Crafty("RightPoints").each(function () {
                this.text(++this.points) });
        }

        this.x += this.dX;
        this.y += this.dY;
    })

    // Add an onHit event for the paddles
    .onHit('Paddle', function () {
        this.dX *= -1;
    });

    //Add Score boards
    Crafty.e("LeftPoints, DOM, 2D, Text")
        .attr({ x: 350, y: 20, w: 100, h: 20, points: 0 })
        .text("0")
        .textColor('#FFFFFF')
        .textFont({ size: '40px', weight: 'bold' });
    Crafty.e("RightPoints, DOM, 2D, Text")
        .attr({ x: 450, y: 20, w: 100, h: 20, points: 0 })
        .text("0")
        .textColor('#FFFFFF')
        .textFont({ size: '40px', weight: 'bold' });
