define(['Phaser'], function(Phaser) {
	var instance = null;
	function create(width, height, id, state) {
		instance = new Phaser.Game(width, height, Phaser.CANVAS, id, state);
		return instance;
	}

	function getInstance() {
		return instance;
	}

	return {
		create: create,
		getInstance: getInstance
	}
});