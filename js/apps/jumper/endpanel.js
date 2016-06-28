define(['Phaser', 'common/instance'], function(Phaser, Instance) {

	var button;
	var game;
	var group;

	function init() {
		game = Instance.getInstance();
		// group = game.add.group();
		button = game.add.button(game.world.centerX - 95, game.world.centerY, 'button', click, this, 2, 1, 0);
		button.inputEnabled = true;
		button.events.onInputOver.add(click, game);
		button.events.onInputDown.add(click, game);
	};

	function click() {
		console.log('click');
		game.gameResumed();
	}

	function show() {
		if(!button) {
			init();
		}
		// group.visible = true;
	};
	function hide() {
		// group.visible = false;
	};
	return {
		show: show,
		hide: hide
	}
});