define(['Phaser', 'common/instance', 'common/panel'], function(Phaser, Instance, Panel) {
	
	function EndPanel(game) {
		Panel.call(this, game);
		var button = game.add.button(game.world.centerX - 95, game.world.centerY, 'button', this.gameReset, this, 2, 1, 0);
		button.inputEnabled = true;
	};

	EndPanel.prototype.gameReset = function() {
		console.log('do here');
		game.state.start('Start');
	};

	EndPanel.prototype = Object.create(Panel.prototype);
	EndPanel.prototype.constructor = EndPanel;


	return EndPanel;
});