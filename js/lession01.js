// Set Scene
let gameScene = new Phaser.Scene('game');
var zzz = 0.1;
var playerX = 2;
// Load Assets
gameScene.preload = function() {
    this.load.image('background', 'Assets/wooden.png');
    this.load.image('slime', 'Assets/ooz_slime.png');
    this.load.image('metal', 'Assets/metal_plates.png');
};

// Create Game
gameScene.create = function() {
    var bg = this.add.sprite(0, 0, 'background');
    bg.setOrigin(0,0);
    this.player = this.add.sprite(150,150, 'slime');
    this.player.setScale(0.2, 0.2);
    
    //this.player.setOrigin(0, 0);
};

gameScene.update = function() {
    this.player.angle += 1;
    if (this.player.scaleX >= 0.2)
    {
        zzz = -0.005;
    }
    else if (this.player.scaleX <= 0.1)
    {
        zzz = 0.0015;
    }
    this.player.scaleX += zzz;
    this.player.scaleY += zzz;

    if (this.player.x >= 400)
    {
        playerX = -2;
    }
    else if (this.player.x <= 150)
    {
        playerX = 2;
    }
    this.player.x += playerX;
};

// Config
let config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: gameScene
};

// Load Game
let game = new Phaser.Game(config);
