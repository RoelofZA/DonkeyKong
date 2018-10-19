

var bootScene  = new Phaser.Class({
    Extends: Phaser.Scene,
    initialize: 
    function bootScene(){
        console.log('[BOOT] init', config);
        Phaser.Scene.call(this, { key: 'boot' });
    },
    preload: () => {
        console.log('[BOOT] preload');
    },
    create: function() {
        console.log('[BOOT] create', config);
        //this.cursors = this.input.keyboard.createCursorKeys();
        
        //game.scene.remove('mainScene');
        //this.scene.add('mainScene', mainScene);
        score = 0;
        this.input.once('pointerdown', function () {
            console.log('From SceneA to SceneB');
            score = 0;
            this.scene.start('waveScene');

        }, this);

        this.input.keyboard.on('keydown', function (event) {
            score = 0;
            this.scene.start('waveScene');
        }, this);

        highScoreTextG = "";

        this.gameName = this.add.text(140, 180, 'Donkey Kong\nvs\nDouble Dragon', { fill: '#0f0', fontSize: '64px', align: 'center' });
        this.gameScores = this.add.text(280, 370, '', { fill: '#00A000', fontSize: '32px', align: 'center' });
        var result = firebase.database().ref('donkeykong/scores').orderByChild('score').limitToLast(5);

        result.on('value', function(snapshot) {
            snapshot.forEach(function(child) {
                var highScore = child.val();
                highScoreTextG = '\n' + highScore.name + '\t' + highScore.score + highScoreTextG;
            });
        }, this);
    },
    update: function(){
        this.gameScores.text = highScoreTextG;
    }
});
