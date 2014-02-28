// Initialize Phaser, and creates a window-sized game
// .AUTO tries defaults to WebGL, if the browser/device doesn’t support it, Canvas
var game = new Phaser.Game($(window).width(), $(window).height(), Phaser.AUTO, 'game_div');
var game_state = {};

// Creates a new 'main' state that wil contain the game
game_state.main = function() { };  

game_state.main.prototype = {

    // Function called first to load all the assets
    preload: function() { 

    // Change the background color of the game
    this.game.stage.backgroundColor = '00FFFF';

    // Change background to picture of the ocean
    // this.game.load.image('ocean', 'assets/water.jpg');
    
    // Load the shark sprite
    this.game.load.spritesheet('shark', '/assets/shark.png', 160, 0);
    // Load bait sprites
    this.game.load.spritesheet('seal', '/assets/seal_right.png', 0, 79);
    this.game.load.image('swimmer', '/assets/swimmer_right.png')
    },

    // Function called after 'preload' to set up the game
    create: function() { 

      // Display score
      this.score = 0;    
      this.score_text = this.game.add.text(50, 30, "Score: 0", { font: "40px Helvetica", fill: "#00000" });   
      // Set health: game end determinant
      this.health = 100; 
      this.health_text = this.game.add.text(300, 30, "Health: 100", { font: "40px Helvetica", fill: "#00000" });

      // Every second loop to timeUp for constant health and score updating
      this.timer = this.game.time.events.loop(Phaser.Timer.SECOND, this.timeUp, this) 

      // Every loop through time randomly to addSeal and addSwimmer
      this.seal_timer = this.game.time.events.loop(Phaser.Timer.SECOND*(Math.random()*10), this.addSeal, this);
      this.swimmer_timer = this.game.time.events.loop(Phaser.Timer.SECOND*(Math.random()*100), this.addSwimmer, this); 

      // Display ocean background
      // this.background = this.game.add.sprite(0, 0, 'ocean');

      // Display moving shark on screen
      this.shark = this.game.add.sprite(this.game.width/2, this.game.height/2, 'shark');
      this.shark.animations.add('swim', [0, 1], 2, true);
      this.shark.animations.play('swim');
      /// Shark cannot move outside of the game world
      this.shark.body.collideWorldBounds = true;

      // Add keys to move the shark up, down, left, and right
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

      // Accounts for diagonal movement
      if (up_key.isDown) {
        player.body.velocity.y = -250;
      } else if (down_key.isDown) {
        player.body.velocity.y = 250;
      }
      if (left_key.isDown) {
        player.body.velocity.x = -250;
      } else if (right_key.isDown) {
        player.body.velocity.x = 250;
      }
    },
    
    // Function called 60 times per second
    update: function() {
      // if shark and seal overlap, seal is eaten
      this.game.physics.overlap(this.shark, this.seal, this.eat, null, this);
      // if shark and swimmer overlap, swimmer is "eaten"
      this.game.physics.overlap(this.shark, this.swimmer, this.eat, null, this);

      // game end state is health reaching zero
      if (this.health <= 0) { this.restart_game() }
    },

    addSeal: function() {
      // Display moving seal sprite at a random position at 0 on the x-axis
      this.seal = this.game.add.sprite(0, (Math.floor(Math.random()*400)+70), 'seal');
      this.seal.animations.add('right', [0, 1, 2], 3, true);
      this.seal.animations.play('right');
      // Add velocity to the seal to make it swim right
      this.seal.body.velocity.x = +(Math.floor(Math.random()*400)+300); 
      // Kill the seal when it's no longer visible 
      this.seal.outOfBoundsKill = true;
    },

    addSwimmer: function() {
      // Display swimmer sprite at a random position at 0 on the x-axis
      this.swimmer = this.game.add.sprite(0, (Math.floor(Math.random()*600)+70), 'swimmer');
      // Add velocity to the swimmer to make it swim right
      this.swimmer.body.velocity.x = +(Math.floor(Math.random()*200)+200); 
      // Kill the swimmer when it's no longer visible 
      this.swimmer.outOfBoundsKill = true;
    },

    // Destroys food, affects points
    eat: function (shark, food) {
      if (food == this.seal) {
        this.seal.kill();
        this.health += 1;
        this.score += 5;
      } else if (food == this.swimmer)
        this.health -= 5;
        this.score -= 10;
    },

    timeUp: function() {
       this.score += 100;
       this.score_text.content = 'Score: ' + this.score;
       this.health -= 1;
       this.health_text.content = 'Health: ' + this.health;
    },

    // Make the shark go up 
    move_up: function() {  
      // Add a vertical velocity to the shark
      this.shark.body.velocity.y = -250;
    },

    // Make the shark go down
    move_down: function() {  
      // Add a vertical velocity to the shark
      this.shark.body.velocity.y = +250;
    },

    // Make the shark go right
    move_right: function() {  
      // Add a horizontal velocity to the shark
      this.shark.body.velocity.x = +250;
    },

    // Make the shark go left
    move_left: function() {  
      // Add a horizontal velocity to the shark
      this.shark.body.velocity.x = -250;
    },

    // Make shark stop moving
    stop_moving: function() {
      this.shark.body.velocity.x = 0;
      this.shark.body.velocity.y = 0;
    },

    // Restart the game
    restart_game: function() {  
      // Reset timers
      this.game.time.events.remove(this.timer);
      this.game.time.events.remove(this.seal_timer);
      this.game.time.events.remove(this.swimmer_timer); 
      // Start the 'main' state, which restarts the game
      this.game.state.start('main');
    },
};

// Add and start the 'main' state to start the game
game.state.add('main', game_state.main);  
game.state.start('main'); 