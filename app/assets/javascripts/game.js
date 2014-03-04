// Initialize Phaser, and creates a window-sized game
// .AUTO tries defaults to WebGL, if the browser/device doesn’t support it, Canvas
var game = new Phaser.Game($(window).width(), $(window).height(), Phaser.AUTO, 'game_div');
var game_state = {};

// Creates a new 'main' state that wil contain the game
game_state.main = function() { };  

game_state.main.prototype = {

    // Function called first to load all the assets
    preload: function() { 

      this.game.reported = false;
      this.game.sped = false;

      // Change the background color of the game
      this.game.stage.backgroundColor = '00FFFF';

      // Change background to picture of the ocean
      // this.game.load.image('ocean', 'assets/water.jpg');

      // Load health bar sprite
      this.game.load.image('healthbar', '/assets/healthBar.png') 
      // Load blood sprite
      this.game.load.image('blood', '/assets/blood.png')   
      // Load the shark sprite
      this.game.load.spritesheet('shark', '/assets/greatwhite.png', 160, 0);
      // Load bait sprites for left side
      this.game.load.spritesheet('seal', '/assets/seal_right.png', 0, 79);
      this.game.load.image('swimmer', '/assets/swimmer_right.png')
      // Load bait sprites for right side
      this.game.load.spritesheet('sealplus', '/assets/seal_left.png', 0, 79);
      this.game.load.image('swimmerplus', '/assets/swimmer_left.png');
      // Load tire sprite
      this.game.load.image('tire', '/assets/tire.png');
    },

    // Function called after 'preload' to set up the game
    create: function() { 

      // Display score
      this.score = 0;    
      this.score_text = this.game.add.text(260, 0, "Score: 0", { font: "30px Helvetica", fill: "#00000" });   
      // Set health: game end determinant
      this.health = 100;
      this.maxHealth = 100;
      this.healthbar = this.game.add.sprite(150, 5, 'healthbar');
      this.health_text = this.game.add.text(50, 0, "Health: ", { font: "30px Helvetica", fill: "#00000" });
      // Set placeholder for end of game screen
      this.end_text = this.game.add.text(50, 60, " ", { font: "30px Helvetica", fill: "#00000" });

      // Every second loop to timeUp for constant health and score updating
      this.timer = this.game.time.events.loop(Phaser.Timer.SECOND, this.healthBar, this) 

      // Every loop through time randomly to addSeal and addSwimmer
      this.seal_timer = this.game.time.events.loop(Phaser.Timer.SECOND*(Math.random()*10), this.addSeal, this);
      this.swimmer_timer = this.game.time.events.loop(Phaser.Timer.SECOND*(Math.random()*30), this.addSwimmer, this); 

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

      // Allows for game restart
      var enter_key = this.game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
      enter_key.onDown.add(this.restart_game, this);

      // Accounts for diagonal movement
      if (up_key.isDown) {
        player.body.velocity.y = -400;
      } else if (down_key.isDown) {
        player.body.velocity.y = 400;
      }
      if (left_key.isDown) {
        player.body.velocity.x = -400;
      } else if (right_key.isDown) {
        player.body.velocity.x = 400;
      }
    },
    
    // Function called 60 times per second
    update: function() {
      // if shark and seal overlap, seal is eaten
      this.game.physics.overlap(this.shark, this.seal, this.eat, null, this);
      // if shark and swimmer overlap, swimmer is "eaten"
      this.game.physics.overlap(this.shark, this.swimmer, this.eat, null, this);

      // speed up bait
      if (this.score >= 100) { 
        if (!this.game.sped) {
          this.speed_up();
          this.game.sped = true;
        }
      }

      // game end state is health reaching zero
      if (this.health <= 0) { this.end_game() }
    },

    speed_up: function() {
      this.seal_plus_timer = this.game.time.events.loop(Phaser.Timer.SECOND*(Math.random()*10), this.addSealPlus, this);
      this.swimmer_plus_timer = this.game.time.events.loop(Phaser.Timer.SECOND*(Math.random()*30), this.addSwimmerPlus, this); 
    },

    addSealPlus: function() {
      // Display moving seal sprite at a random position at 0 on the x-axis
      this.sealplus = this.game.add.sprite(this.game.width-100, (Math.floor(Math.random()*400)+70), 'sealplus');
      this.sealplus.animations.add('left', [0, 1, 2], 3, true);
      this.sealplus.animations.play('left');
      // Add velocity to the seal to make it swim right
      this.sealplus.body.velocity.x = -(Math.floor(Math.random()*400)+600); 
      // Kill the seal when it's no longer visible 
      this.sealplus.outOfBoundsKill = true;
    },

    addSeal: function() {
      // Display moving seal sprite at a random position at 0 on the x-axis
      this.seal = this.game.add.sprite(0, (Math.floor(Math.random()*400)+70), 'seal');
      this.seal.animations.add('right', [0, 1, 2], 3, true);
      this.seal.animations.play('right');
      // Add velocity to the seal to make it swim right
      this.seal.body.velocity.x = +(Math.floor(Math.random()*400)+600); 
      // Kill the seal when it's no longer visible 
      this.seal.outOfBoundsKill = true;
    },

    addSwimmerPlus: function() {
      // Display swimmer sprite at a random position at 0 on the x-axis
      this.swimmerplus = this.game.add.sprite(this.game.width-100, (Math.floor(Math.random()*600)+70), 'swimmerplus');
      // Add velocity to the swimmer to make it swim right
      this.swimmerplus.body.velocity.x = -(Math.floor(Math.random()*300)+400); 
      // Kill the swimmer when it's no longer visible 
      this.swimmerplus.outOfBoundsKill = true;
    },

    addSwimmer: function() {
      // Display swimmer sprite at a random position at 0 on the x-axis
      this.swimmer = this.game.add.sprite(0, (Math.floor(Math.random()*600)+70), 'swimmer');
      // Add velocity to the swimmer to make it swim right
      this.swimmer.body.velocity.x = +(Math.floor(Math.random()*300)+400); 
      // Kill the swimmer when it's no longer visible 
      this.swimmer.outOfBoundsKill = true;
    },

    // Destroys food, affects points
    eat: function (shark, food) {
      if (food == this.seal) {
        // Add blood sprite where shark was, offset by 200 to account for size of shark transparency layer
        this.blood = this.game.add.sprite(this.shark.x - 200, this.shark.y - 200, 'blood');
        this.blood.animations.add('die', 60, false, false);
        this.blood.animations.play('die');
        this.seal.kill();
        this.health += 1;
        this.score += 5;
      } else if (food == this.swimmer) {
        // Add blood sprite where shark was, offset by 200 to account for size of shark transparency layer
        this.blood = this.game.add.sprite(this.shark.x - 200, this.shark.y - 200, 'blood');
        this.blood.animations.add('die', 60, false, false);
        this.blood.animations.play('die');
        this.swimmer.kill();
        this.health -= 5;
        this.score -= 10;
      }
      this.score_text.content = 'Score: ' + this.score; 
    },

    healthBar: function() {
      this.health -= 1;
      this.healthbar.cropEnabled = true;
      this.healthbar.crop.width = (this.health / this.maxHealth) * this.healthbar.width;
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

    // Ajax call to send score to database
    send_score: function() {
      var self = this;
      $.ajax({
        type: "POST",
        url: "/score",
        data: {points: self.score},
        dataType: "json",
        success: function(data) {
          console.log(data);
        }
      })
    },

    // End of game
    end_game: function() {
      if (!this.game.reported){
        this.send_score();
        console.log(this.game.reported)
        this.game.reported = true;
      }
      // Reset timers
      this.game.time.events.remove(this.timer);
      this.game.time.events.remove(this.seal_timer);
      this.game.time.events.remove(this.swimmer_timer);
      this.end_text.content = "You lose! Your score was " + this.score + ", press enter to play again!"; 
    },

    // Restart the game
    restart_game: function() {  
      // Start the 'main' state, which restarts the game
      this.game.state.start('main');
    }
};

// Add and start the 'main' state to start the game
game.state.add('main', game_state.main);  
game.state.start('main'); 