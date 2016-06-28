define(['Phaser', 'common/instance'], function(Phaser, Instance) {

	var button;
	var game;
	var group;

	function init() {
		game = Instance.getInstance();
		// group = game.add.group();

		button = game.add.button(game.world.centerX - 95, game.world.centerY, 'button', click, this, 2, 1, 0);
		button.inputEnabled = true;
		
		button.visible = false;
		// button.events.onInputDown.add(click, this);
	};

	function click(sprite, pointer) {
		game.state.start('Start');
		// game.gameResumed();
	}

	function show() {
		button.visible = true;
	};
	function hide() {
		button.visible = false;
	};
	return {
		init: init,
		show: show,
		hide: hide
	}
});