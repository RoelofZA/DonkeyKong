

var gameOver  = new Phaser.Class({
    Extends: Phaser.Scene,
    initialize: 
    function gameOver(){
        console.log('[gameOver] init', config);
        Phaser.Scene.call(this, { key: 'gameOver' });
    },
    preload: function() {
        console.log('[gameOver] preload');
    },
    create: function() {
        console.log('[gameOver] create', config);

         this.time.delayedCall(3000, function() {
            this.scene.start('boot');
        }, [], this); 
        this.scene.bringToTop();
        this.gameOverText = this.add.text(140, 180, 'GAME OVER', { fill: '#f00', fontSize: '64px', align: 'center' });
    },
    update: function(){
        
    }
});