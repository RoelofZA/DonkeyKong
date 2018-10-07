

const bootScene  = new Phaser.Class({
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

        this.input.once('pointerdown', function () {

            console.log('From SceneA to SceneB');
            
            this.game.scene.start('mainScene');

        }, this);

        this.ScoreCard = this.add.text(140, 180, 'Donkey Kong\nvs\nDouble Dragon', { fill: '#0f0', fontSize: '64px', align: 'center' });
    },
    update: function(){

    }
});