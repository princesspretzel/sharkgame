
var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', { preload: preload, create: create });

function preload() {

    game.load.image('ilkke', 'assets/sprites/ilkke.png');

}

var sprite1;
var sprite2;
var sprite3;

function create() {

    game.stage.backgroundColor = '#2d2d2d';

    //  Set the world (global) gravity
    game.physics.gravity.y = 100;

    //  Sprite 1 will use the World (global) gravity
    sprite1 = game.add.sprite(300, 32, 'ilkke');
    sprite1.body.collideWorldBounds = true;
    sprite1.body.bounce.y = 0.8;

    //  Sprite 2 is set to ignore the global gravity and use its own value
    sprite2 = game.add.sprite(400, 32, 'ilkke');
    sprite2.body.collideWorldBounds = true;
    sprite2.body.bounce.y = 0.8;
    sprite2.body.allowGravity = false;
    sprite2.body.gravity.y = 100;

    //  Sprite 3 will use both the global gravity and its own value
    sprite3 = game.add.sprite(500, 32, 'ilkke');
    sprite3.body.collideWorldBounds = true;
    sprite3.body.bounce.y = 0.8;
    sprite3.body.gravity.y = 100;

}
