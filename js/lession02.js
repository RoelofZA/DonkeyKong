// Set Scene
var gameScene = new Phaser.Scene('game');
var zzz = 0.1;
var playerX = 2;
var player, cursors, speed = 300;
var bored = false;

// Config
var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: gameScene,
    physics: {
        default: 'arcade',
        arcade: {
            debug: false
        }
    },
    
};

// Load Game
var game = new Phaser.Game(config);

// Load Assets
gameScene.preload = function() {
    this.load.image('background', 'Assets/background/bgcity2.jpg');
    this.load.image('slime', 'Assets/ooz_slime.png');
    this.load.image('metal', 'Assets/metal_plates.png');
    this.load.spritesheet('idle', 'assets/sprites/simonspritesheet.png', { frameWidth: 32, frameHeight: 47, endFrame: 9 });
    this.load.spritesheet('walk', 'assets/sprites/simonspritesheet.png', { frameWidth: 32, frameHeight: 47, startFrame: 10, endFrame: 13 });
};

// Create Game
gameScene.create = function() {

    this.cameras.main.setBounds(0, 0, 3494/2, 1200/2);
    this.physics.world.setBounds(0, 150, 3494/2, 880/2);

    cursors = this.input.keyboard.createCursorKeys();

    var background = this.add.sprite(0, 0, 'background');
    background.setOrigin(0,0);
    background.setScale(0.5,0.5);
    


    var config = {
        key: 'idleAnimation',
        frames: this.anims.generateFrameNumbers('idle', { frame: 0 }),
        frameRate: 20
    };
    this.anims.create(config);

    this.anims.create({
        key: 'boredAnimation',
        frames: this.anims.generateFrameNumbers('idle', { start: 0, end: 9, first: 0 }),
        frameRate: 20,
        repeat: -1
    });

    var configWalk = {
        key: 'walkAnimation',
        frames: this.anims.generateFrameNumbers('walk', { start: 10, end: 13, first: 10 }),
        frameRate: 6,
        repeat: -1
    };
    this.anims.create(configWalk);
    
    player = this.physics.add.sprite(150, 150, 'idle');
    player.setScale(4,4);
    //player.play('idleAnimation');
    //player = this.physics.add.image(150, 150, 'slime');
    //player.setScale(0.2, 0.2);
    
    player.setCollideWorldBounds(true);

    //timedEvent = this.time.delayedCall(3000, onEvent, [], this);

    this.cameras.main.startFollow(player, true);
    // this.cameras.main.startFollow(player, true, 0.1, 0.1);

    this.cameras.main.setDeadzone(300, 200);
    //this.cameras.main.setZoom(1);
};

gameScene.update = function() {
    player.setVelocity(0);
    player.rotation = 0;
    

    if (cursors.left.isDown)
    {
        //player.anims.remove('boredAnimation');
        player.setVelocityX(-speed);
        player.anims.play('walkAnimation', true);
        player.flipX = true;
        bored = false;
        //player.angle = -15;
    }
    else if (cursors.right.isDown)
    {
        //player.anims.remove('boredAnimation');
        player.setVelocityX(speed);
        player.anims.play('walkAnimation', true);
        player.flipX = false;
        bored = false;
    }
    else
    {
        if(!bored){
            bored = true;
            player.anims.play('idleAnimation');
        }

        if (cursors.down.isDown)
        {
            player.setVelocityY(speed);
        } else if (cursors.up.isDown)
        {
            player.setVelocityY(-speed);
        }
    }
};

function onEvent ()
{
    bored = true;
    player.anims.play('boredAnimation', true);
}