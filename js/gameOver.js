

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

         this.time.delayedCall(33000, function() {
            this.scene.start('boot');
        }, [], this); 
        this.scene.bringToTop();
        this.gameOverText = this.add.text(170, 180, 'GAME OVER', { fill: '#f00', fontSize: '64px', align: 'center' });
        this.highScoresCaptionText = this.add.text(170, 250, 'High Scores:', { fill: '#00f', fontSize: '64px', align: 'center' });
        this.highScoresText = this.add.text(220, 300, '', { fill: '#0f0', fontSize: '20px', align: 'center' });

        var result = starCountRef.orderByChild('score').limitToLast(10).on('child_added', function(snapshot) {
            var highScore = snapshot.val();
            highScoreTextG = '\n' + highScore.name + '\t' + highScore.score + highScoreTextG;
        });
        
    },
    update: function(){
        this.highScoresText.setText(highScoreTextG);
    }
});