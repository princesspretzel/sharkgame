// Initialize Phaser, and creates a window-sized game
// .AUTO tries defaults to WebGL, if the browser/device doesn’t support it, Canvas
var game = new Phaser.Game($(window).width(), $(window).height(), Phaser.AUTO, 'game_div');
var game_state = {};

// Creates a new 'main' state that wil contain the game
game_state.main = function() { };  

game_state.main.prototype = {

    preload: function() { 
    // Function called first to load all the assets

    // Change the background color of the game
    this.game.stage.backgroundColor = '00FFFF';

    // Change background to picture of the ocean
    // this.game.load.image('ocean', 'assets/water.jpg');
    
    // Load the shark sprite
    this.game.load.spritesheet('shark', '/assets/sharksprite.png', 268, 0);

    // Load bait sprites
    this.game.load.spritesheet('seal', '/assets/seal.png', 0, 141);

    },

    // Function called after 'preload' to set up the game
    create: function() { 

      // Display score
      this.score = 0;  
      var style = { font: "40px Helvetica", fill: "#00000" };  
      this.score_label = this.game.add.text(50, 30, "Score: 0", style);    
      
      // Set health: game end determinant
      this.health = 0;
      var style = { font: "40px Helvetica", fill: "#00000" };  
      this.score_label = this.game.add.text(300, 30, "Health: 100", style);

      // Set timer
      // this.timer = this.game.time.events.loop(Math.random()*100), this.add_seal, this);  

      // Display ocean background
      // this.background = this.game.add.sprite(0, 0, 'ocean');

      // Display moving shark on screen
      this.shark = this.game.add.sprite(this.game.width/2, this.game.height/2, 'shark');
      this.shark.animations.add('always', [0, 1], 2, true);
      this.shark.animations.play('always');
      /// Shark cannot move outside of the game world
      this.shark.body.collideWorldBounds = true;

      // Controls to move the shark up, down, left, and right
      var up_key = this.game.input.keyboard.addKey(Phaser.Keyboard.UP);
      up_key.onDown.add(this.move_up, this);
      // On key release, movement stops
      up_key.onUp.add(this.stop_moving, this);

      var down_key = this.game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
      down_key.onDown.add(this.move_down, this); 
      down_key.onUp.add(this.stop_moving, this);

      var right_key = this.game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
      right_key.onDown.add(this.move_right, this); 
      right_key.onUp.add(this.stop_moving, this);

      var left_key = this.game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
      left_key.onDown.add(this.move_left, this);
      left_key.onUp.add(this.stop_moving, this);

      // Display moving seal sprite at position 0, 0
      this.seal = this.game.add.sprite(0, (Math.floor(Math.random()*400)+70), 'seal');
      this.seal.animations.add('right', [0, 1, 2], 3, true);
      this.seal.animations.play('right');
      // Add velocity to the seal to make it swim right
      this.seal.body.velocity.x = +(Math.floor(Math.random()*500)+200); 
      // Kill the seal when it's no longer visible 
      this.seal.outOfBoundsKill = true;

        // add_seal: function(x, y){
        //   // Get the first dead seal of our group (they default to dead)
        //   var seal = this.seals.getFirstDead();
        //   // Set the new position of the seal
        //   seal.reset(x, y);
        // },

        // add_row_of_seals: function() {  
        // var hole = Math.floor(Math.random()*3)+1;

        // for (var i = 0; i < 8; i++)
        //    if (i != hole && i != hole +1) 
        //    this.add_one_seal(0, 0);   
        // },
    },
    
    // Function called 60 times per second
    update: function() {
    //this.game.physics.overlap(this.shark, this.seal, eat, null, this);
    },

    // Destroys seals
    eat: function () {
      seal.kill();
    },

    // Make the shark go up 
    move_up: function() {  
      // Add a vertical velocity to the shark
      this.shark.body.velocity.y = -200;
    },

    // Make the shark go down
    move_down: function() {  
      // Add a vertical velocity to the shark
      this.shark.body.velocity.y = +200;
    },

    // Make the shark go right
    move_right: function() {  
      // Add a horizontal velocity to the shark
      this.shark.body.velocity.x = +200;
    },

    // Make the shark go left
    move_left: function() {  
      // Add a horizontal velocity to the shark
      this.shark.body.velocity.x = -200;
    },

    // Make shark stop moving
    stop_moving: function() {
      this.shark.body.velocity.x = 0;
      this.shark.body.velocity.y = 0;
    },

    // Restart the game
    restart_game: function() {  
      // Reset timer
      this.game.time.events.remove(this.timer); 
      // Start the 'main' state, which restarts the game
      this.game.state.start('main');
    },
};

// Add and start the 'main' state to start the game
game.state.add('main', game_state.main);  
game.state.start('main'); 