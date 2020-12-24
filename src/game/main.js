game.module(
    'game.main'
).require(
    'game.assets'
)
.body(function() {

game.createScene('Main', {
    init: function() {
        
        this.mps_body = new game.Sprite('Mazda3MPS__mainframe.png');
        this.mps_mask = new game.Sprite('Mazda3MPS__mask.png');
        this.mps_ftyre = new game.Sprite('Mazda3MPS_tyre--front.png');
        this.mps_rtyre = new game.Sprite('Mazda3MPS_tyre--rear.png');
        
        this.mps_body.scale.x = this.mps_body.scale.y = 0.3;
        this.mps_mask.scale.x = this.mps_mask.scale.y = 0.3;
        this.mps_ftyre.scale.x = this.mps_ftyre.scale.y = 0.3;
        this.mps_rtyre.scale.x = this.mps_rtyre.scale.y = 0.3;
        
        this.mps_ftyre.anchor.set(110, 104);
        this.mps_rtyre.anchor.set(110, 104);
        this.mps_body.position.set(150, 700);
        this.mps_mask.position.set(150, 700);
        this.mps_ftyre.position.set(232, 820);
        this.mps_rtyre.position.set(504, 820);
        
        this.mps_mask.addTo(this.stage);
        this.mps_body.addTo(this.stage);
        this.mps_ftyre.addTo(this.stage);
        this.mps_rtyre.addTo(this.stage);
        
    },
        update: function() {
        this.mps_ftyre.rotation -= 8 * game.delta;
        this.mps_rtyre.rotation -= 8 * game.delta;
    }
});



});
