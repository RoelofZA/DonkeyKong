// Set Scene
let gameScene = new Phaser.Scene('game');

// Load Assets
gameScene.preload = function() {
    this.load.image('background', 'Assets/wooden.png');
    this.load.image('slime', 'Assets/ooz_slime.png');
    this.load.image('metal', 'Assets/metal_plates.png');
};

// Create Game
gameScene.create = function() {
    let bg = this.add.sprite(0, 0, 'background');
    bg.setOrigin(0,0);
    var player = this.add.sprite(29,29, 'slime');
    player.setScale(0.5, 0.5);
    player.setOrigin(0, 0);
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
