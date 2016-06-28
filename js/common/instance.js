define(['Phaser'], function(Phaser) {
	var instance = null;
	function create(state) {
		instance = new Phaser.Game(320, 568, Phaser.AUTO, 'phaser-exmaple',state);
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