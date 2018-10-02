// Set Scene
var gameScene = new Phaser.Scene('game');
var zzz = 0.1, bb;
var playerX = 2;
var player, enemy, cursors, speed = 300;
var bored = false;
var bullets, bulletDirection;
var lastFired = 0;
var speed = 300;
var movingLeft = false, movingRight = false;

// Config
var config = {
    type: Phaser.AUTO,
    antialias: false,
    width: 800,
    height: 600,
    scene: gameScene,
    physics: {
        default: 'arcade',
        arcade: {
            debug: true
        }
    },
    
};

// Load Game
var game = new Phaser.Game(config);

// Load Assets
gameScene.preload = function() {
    this.load.image('background', 'Assets/background/bgcity.jpg');
    this.load.image('slime', 'Assets/ooz_slime_small.png');
    this.load.image('metal', 'Assets/metal_plates_small.png');
    this.load.spritesheet('idle', 'assets/sprites/simonspritesheet.png', { frameWidth: 32, frameHeight: 47, endFrame: 9 });
    this.load.spritesheet('walk', 'assets/sprites/simonspritesheet.png', { frameWidth: 32, frameHeight: 47, startFrame: 10, endFrame: 13 });
};

// Create Game
gameScene.create = function() {

    this.cameras.main.setBounds(0, 0, 3494/2, 1200/2);
    this.physics.world.setBounds(0, 0, 3494/2, 880/2);

    cursors = this.input.keyboard.createCursorKeys();

    for (x = 0; x < 3; x++)
    {
        var bg = this.add.image((1747*0.3) * x, 0, 'background').setOrigin(0);
        bg.setScale(0.3,0.3);
    }

    // Add Bullets
    var Bullet = new Phaser.Class({

        Extends: Phaser.Physics.Arcade.Sprite,

        initialize:

        function Bullet (scene)
        {
            Phaser.Physics.Arcade.Sprite.call(this, scene, 0, 0, 'slime');
            this.pathSpeed = Phaser.Math.GetSpeed(2000, 0.1);
            this.born = 0;
        },

        fire: function (x, y)
        {
            this.setPosition(x+50, y);
            this.setActive(true);
            this.setVisible(true);
            this.born = 0;
        },

        preUpdate: function (time, delta)
        {
            this.anims.update(time, delta);
        },
        update: function(time, delta)
        {
            if (this.active === false){
                return;
            }

            console.log(this.active);
            var i = 1;
            if (bulletDirection) i=-1;
            
            this.setPosition(this.x + (this.pathSpeed * i), this.y);

            this.born += delta;

            //console.log(this.born);
            if (this.born >=400)
            {
                this.setActive(false);
                this.setVisible(false);
                this.destroy();
            } 
        }

    });
    
    bullets = this.physics.add.group({
        classType: Bullet,
        maxSize: 1,
        runChildUpdate: true
    });

    enemies = this.physics.add.group();

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
    player.setBounce(1, 1);
    player.setCollideWorldBounds(true);

    this.cameras.main.startFollow(player, true);
    this.cameras.main.setDeadzone(300, 200);

    enemies.createMultiple({ 
        key: 'metal', 
        frame: [0], 
        frameQuantity: 1, 
        repeat: 5,
        immovable: true });

    Phaser.Actions.SetXY(enemies.getChildren(), 500, 350, 200);

    //bb = this.physics.add.collider(player, enemies, walkIntoEnemy);
    this.physics.add.overlap(player, enemies, walkIntoEnemyO);
};

gameScene.update = function(time, delta) {

    
    
    // Get bullet from bullets group

    if (cursors.space.isDown && time > lastFired)
    {
        
        var bullet = bullets.get();
        if (bullet)
        {
            //bullet.setActive(true).setVisible(true);
            //bullet.fire(player, player);
            //debugger;
            bullet.fire(player.x, player.y);
            this.physics.add.collider(enemies, bullets, hitEnemy, function ()
            {
                this.physics.world.removeCollider(this);
            }, this);
            bulletDirection = player.flipX;
            lastFired = time + 50;
            console.log('fire');
        }
    }

    if (cursors.left.isDown && !movingLeft)
    {
        if (this.physics.world.collide(player, enemies) || this.physics.world.overlap(player, enemies))
            return;

        player.setVelocityX(-speed);
        player.anims.play('walkAnimation', true);
        player.flipX = true;
        bored = false;
    }
    else if (cursors.right.isDown && !movingRight)
    {
        if (this.physics.world.collide(player, enemies) || this.physics.world.overlap(player, enemies))
            return;

        //movingRight = true;
        player.setVelocityX(speed);
        player.anims.play('walkAnimation', true);
        player.flipX = false;
        bored = false;
    }
    else
    {
        //movingLeft = false;
        //movingRight = false;
        player.setVelocity(0);

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

function hitEnemy(playerHit, bulletHit)
{
    //console.log(playerHit);
    //debugger;
    bullets.killAndHide(bulletHit);
    enemies.killAndHide(playerHit);
    playerHit.destroy();
    bulletHit.destroy();

    /* if (enemy.active === true)
    {
        console.log('Woof');
        // Destroy bullet
        bulletHit.setActive(false).setVisible(false);
        //bulletHit.destroy();
        playerHit.setVisible(false).setActive(false);
    } */
}
function walkIntoEnemyO(playerHit, enemy)
{
    debugger;
    playerHit.x = playerHit.x + ((playerHit.body.velocity.x/60)*-1);

/*     player.body.stop();
    player.setVelocityX(0); */

    playerHit.body.stop();
    playerHit.setVelocityX(0);

}
