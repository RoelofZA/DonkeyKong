var mainScene = new Phaser.Class({
    Extends: Phaser.Scene,
    active: true,
    initialize: 
    function mainScene(config) {
        console.log('[mainScene] init', config);
        Phaser.Scene.call(this, {key: "mainScene"});
        
    }, 
    preload: function() {
        console.log('[mainScene] preload');
        this.load.image('background', 'Assets/background/bgcity.jpg');
        this.load.image('metal', 'Assets/metal_plates_small.png');
        this.load.spritesheet('idle', 'Assets/sprites/simonspritesheet.png', { frameWidth: 32, frameHeight: 46, endFrame: 9 });
        this.load.spritesheet('walk', 'Assets/sprites/simonspritesheet.png', { frameWidth: 32, frameHeight: 46, startFrame: 10, endFrame: 13 });
        this.load.spritesheet('playerFire', 'Assets/sprites/simonspritesheet.png', { frameWidth: 39, frameHeight: 46, startFrame: 0, endFrame: 50 });
        this.load.spritesheet('skeletonWalk', 'Assets/sprites/skeleton.png', { frameWidth: 224, frameHeight: 368, endFrame: 8 });
    },
    create: function() {
        console.log('[mainScene] create');

        this.lastFired = 0;
        this.bored = false;
        this.movingLeft = false;
        this.playerHealth = 100;
        this.boundsX = 3494/2;
        this.boundsY = 1200/2;

        this.cameras.main.setBounds(0, 0, this.boundsX, this.boundsY);
        this.physics.world.setBounds(0, 200, this.boundsX, this.boundsY-270);
        cursors1 = null;
        cursors1 = this.input.keyboard.createCursorKeys();

        for (x = 0; x < 3; x++)
        {
            var bg = this.add.image((1747*0.3) * x, 0, 'background').setOrigin(0);
            bg.setScale(0.354,0.354);
        }

        // Add Bullets
        var Bullet = new Phaser.Class({

            Extends: Phaser.Physics.Arcade.Sprite,

            initialize:

            function Bullet (scene)
            {
                Phaser.Physics.Arcade.Sprite.call(this, scene, 0, 0, 'metal');
                this.pathSpeed = Phaser.Math.GetSpeed(2000, 0.1);
                this.born = 0;
            },

            fire: function (x, y)
            {
                this.setPosition(x+50, y-25);
                this.setScale(0.1, 0.1);
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
                var i = 1;
                if (bulletDirection) i=-1;
                
                this.setPosition(this.x + (this.pathSpeed * i), this.y);

                this.born += delta;
                if (this.born >=400)
                {
                    this.setActive(false);
                    this.setVisible(false);
                    this.destroy();
                } 
            }

        });
        
        this.bullets = this.physics.add.group({
            classType: Bullet,
            maxSize: 1,
            runChildUpdate: true
        });

        this.enemies = this.physics.add.group();

        //debugger;
        if (this.anims.get('idleAnimation')===undefined)
        {
            this.anims.create({
                key: 'idleAnimation',
                frames: this.anims.generateFrameNumbers('idle', { frame: 0 }),
                frameRate: 20
            });

            this.anims.create({
                key: 'playerFire',
                frames: this.anims.generateFrameNumbers('playerFire', { start: 32, end: 34, first: 32 }),
                frameRate: 10
            });

            this.anims.create({
                key: 'boredAnimation',
                frames: this.anims.generateFrameNumbers('idle', { start: 0, end: 9, first: 0 }),
                frameRate: 20,
                repeat: -1
            });

            this.anims.create({
                key: 'walkAnimation',
                frames: this.anims.generateFrameNumbers('walk', { start: 10, end: 13, first: 10 }),
                frameRate: 6,
                repeat: -1
            });

            this.anims.create({
                key: 'skeletonWalkAnimation',
                frames: this.anims.generateFrameNumbers('skeletonWalk', { start: 0, end: 7, first: 0 }),
                frameRate: 6,
                repeat: -1
            });
        }
        
        this.player = this.physics.add.sprite(150, 250, 'idle');
        this.player.setSize(11, 11, true);
        this.player.setScale(4,4);
        this.player.setBounce(0, 0);
        this.player.setCollideWorldBounds(true);

        this.cameras.main.startFollow(this.player, true);
        this.cameras.main.setDeadzone(300, 200);

        this.enemies.createMultiple({ 
            key: 'skeletonWalk', 
            frame: [0], 
            frameQuantity: 1, 
            repeat: 10,
            immovable: true,
            setScale: {x:0.2}});
        
            //debugger;
            var childern = this.enemies.getChildren();

        for (index = 0; index < childern.length; ++index) {
            childern[index].anims.play('skeletonWalkAnimation', true);
            childern[index].setVelocityX(-(60 + (enemyWave*20) + (10 * Math.random())));
            childern[index].setCollideWorldBounds(true);
        }

        this.time.addEvent({ delay: 2000, callback: function() {
            var childern = this.enemies.getChildren();
            for (index = 0; index < childern.length; ++index) {
                var playerDirection =  childern[index].x >= this.player.x;
                childern[index].setVelocityX((60 + (enemyWave*20) + (10 * Math.random())) * (playerDirection?-1:1));
            }
        }, callbackScope: this, repeat:100 });

        // Add Score
        this.ScoreCard = this.add.text(10, 10, 'Score: ' + score + ' Health: ' + this.playerHealth, { fill: '#0f0' });
        this.ScoreCard.setScrollFactor(0);

        var rect = new Phaser.Geom.Rectangle(300, 290, this.boundsX, this.boundsY-370);

        //  Randomly position the sprites within the rectangle
        Phaser.Actions.RandomRectangle(this.enemies.getChildren(), rect);

        //Phaser.Actions.SetXY(this.enemies.getChildren(), 500, 350, 200);
        this.physics.add.overlap(this.player, this.enemies, this.walkIntoEnemyO, null, this);

    },
    update: function(time, delta) {
        if (cursors1.space.isDown && time > this.lastFired)
        {
            var bullet = this.bullets.get();
            if (bullet)
            {
                this.player.anims.play('playerFire', true);
                bullet.fire(this.player.x, this.player.y);
                this.physics.add.collider(this.enemies, this.bullets, this.hitEnemy, function ()
                {
                    this.physics.world.removeCollider(this);
                }, this);
                bulletDirection = this.player.flipX;
                this.lastFired = time + 1000;
                console.log('fire');
            }
        }

        if (cursors1.left.isDown && !this.movingLeft)
        {
            if (this.physics.world.collide(this.player, this.enemies) || this.physics.world.overlap(this.player, this.enemies))
                return;

            this.player.setVelocityX(-speed);
            this.player.anims.play('walkAnimation', true);
            this.player.flipX = true;
            this.bored = false;
        }
        else if (cursors1.right.isDown)
        {
            if (this.physics.world.collide(this.player, this.enemies) || this.physics.world.overlap(this.player, this.enemies))
                return;

            this.player.setVelocityX(speed);
            this.player.anims.play('walkAnimation', true);
            this.player.flipX = false;
            this.bored = false;
        }
        else
        {
            this.player.setVelocity(0);

            if(!this.bored){
                this.bored = true;
                this.player.anims.play('idleAnimation');
            }

            if (cursors1.down.isDown)
            {
                this.player.setVelocityY(speed);
            } else if (cursors1.up.isDown)
            {
                this.player.setVelocityY(-speed);
            }
        }
    },
    hitEnemy: function(playerHit, bulletHit)
    {
        console.log('hitEnemy');
        this.bullets.killAndHide(bulletHit);
        this.enemies.killAndHide(playerHit);
        playerHit.destroy();
        bulletHit.destroy();
        score+= 1;
        this.ScoreCard.text = 'Score: ' + score + ' Health: ' + this.playerHealth;

        console.log('Count Active Enemies: ' + this.enemies.countActive());

        if (this.enemies.countActive() == 0)
        {
            enemyWave++;
            this.scene.start('waveScene');
        }
    },
    walkIntoEnemyO: function(playerHit, enemy)
    {
        console.log('walkIntoEnemyO');
        playerHit.x = playerHit.x + ((playerHit.body.velocity.x/60)*-1);
        playerHit.body.stop();
        playerHit.setVelocityX(0);
        enemy.setVelocityX(0);
        this.playerHealth--;
        if (this.playerHealth<=0)
        {
            enemyWave = 1;
            this.scene.start('gameOver');
        }
        this.ScoreCard.text = 'Score: ' + score + ' Health: ' + this.playerHealth;
    }
});