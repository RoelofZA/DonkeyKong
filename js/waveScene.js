

var waveScene  = new Phaser.Class({
    Extends: Phaser.Scene,
    initialize: 
    function waveScene(){
        console.log('[waveScene] init', config);
        Phaser.Scene.call(this, { key: 'waveScene' });
    },
    preload: function() {
        console.log('[waveScene] preload');
    },
    create: function() {
        console.log('[waveScene] create', config);

         this.time.delayedCall(2000, function() {
            this.scene.stop('mainScene');
            this.scene.start('mainScene');
        }, [], this); 

        this.scene.bringToTop();
        
        this.nextWaveText = this.add.text(300, 200, 'Wave ' + enemyWave.toString(), { fill: '#f00', fontSize: '64px', align: 'center' });
        this.nextWaveText.x = 400 - (this.nextWaveText.width/2);
    },
    update: function(){
    }
});