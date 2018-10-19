var enemyWave = 1, score = 0, cursors1;

var zzz = 0.1, bb;
var playerX = 2;
var bored = false;
var bullets1, bulletDirection;
var highScoreTextG = "";

var speed = 300;
var movingLeft = false, movingRight = false;
var showSplashScreen = true;

// Config
var config = {
    type: Phaser.AUTO,
    antialias: false,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    scene: [ bootScene, mainScene, gameOver, waveScene ],
    physics: {
        default: 'arcade',
        arcade: {
            debug: false
        }
    },
    
};


// Load Game
var game = new Phaser.Game(config);
function onEvent ()
{
    bored = true;
    player.anims.play('boredAnimation', true);
}
