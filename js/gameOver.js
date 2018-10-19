

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

         this.time.delayedCall(10000, function() {

            if(score>0){
                starCountRef.push({
                    name: 'Anonymous',
                    score: score
                });
            }

            this.scene.start('boot');
        }, [], this); 
        this.scene.bringToTop();
        this.gameOverText = this.add.text(170, 180, 'GAME OVER', { fill: '#f00', fontSize: '64px', align: 'center' });

        this.gameOverText.x = 400 - (this.gameOverText.width/2);

        this.highScoresCaptionText = this.add.text(170, 250, 'High Scores:', { fill: '#00f', fontSize: '64px', align: 'center' });
        this.highScoresText = this.add.text(220, 300, '', { fill: '#0f0', fontSize: '20px', align: 'center' });

        this.highScoresCaptionText.x = 400 - (this.highScoresCaptionText.width/2);
        this.highScoresText.x = 400 - (this.highScoresText.width/2);

        askName = this.add.text(100, 50, 'Enter your name:', { font: '32px Courier', fill: '#ffffff' , align: 'center'});
        textEntry = this.add.text(400, 90, '', { font: '32px Courier', fill: '#ffffff' , align: 'center'});

        askName.x = 400 - (askName.width/2);
        textEntry.x = askName.x;

        keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        keyBackspace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.BACKSPACE);

        this.input.keyboard.on('keydown', function (event) {

            if (event.keyCode === 8 && textEntry.text.length > 0)
            {
                textEntry.text = textEntry.text.substr(0, textEntry.text.length - 1);
            }
            else if (event.keyCode === 32 || (event.keyCode >= 48 && event.keyCode <= 90))
            {
                textEntry.text += event.key;
            }
            else if (textEntry.text.length > 0 && event.keyCode === Phaser.Input.Keyboard.KeyCodes.ENTER)
            {
                //Update Score
                starCountRef.push({
                    name: textEntry.text,
                    score: score
                });

                textEntry.destroy();
                askName.destroy();

                score = 0;

                var result = firebase.database().ref('donkeykong/scores').orderByChild('score').limitToLast(5);
                highScoreTextG = "";
                result.on('value', function(snapshot) {
                    snapshot.forEach(function(child) {
                        var highScore = child.val();
                        highScoreTextG = '\n' + highScore.name + '\t' + highScore.score + highScoreTextG;
                        console.log(highScoreTextG);
                    });
                }, this);
                
            }
        });
    },
    update: function(){
        this.highScoresText.setText(highScoreTextG);
        this.highScoresText.x = 400 - (this.highScoresText.width/2);
    }
});