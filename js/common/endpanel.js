define(['Phaser', 'common/instance', 'common/panel'], function(Phaser, Instance, Panel) {
	
	function EndPanel(game) {
		Panel.call(this, game);
		var button = game.add.button(game.world.centerX - 95, game.world.centerY, 'button', this.gameReset, this, 2, 1, 0);
		button.inputEnabled = true;
		this.game = game;
	};

	EndPanel.prototype = Object.create(Panel.prototype);
	EndPanel.prototype.constructor = EndPanel;

	EndPanel.prototype.gameReset = function() {
		console.log('do here');
		this.game.state.start('Start');
	};

	return EndPanel;
});