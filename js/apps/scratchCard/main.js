define(['Phaser', 'common/instance', 'common/loadbar', 'common/endpanel'], function(Phaser, Instance, Loadbar, EndPanel) {
	var states = {};
	var game;
	states.start = function() {};
	states.ing = function() {};
	states.end = function() {};
	states.start.prototype = Object.create(states.start.prototype);
	states.start.prototype.constructor = states.start;
	states.start.prototype.preload = function() {
		game.load.image('pic', 'js/apps/scratchCard/assets/questar.png');
	};
	states.start.prototype.create = function() {
		game.state.start('ing');
	};
	states.start.prototype.update = function() {

	}

	states.ing.prototype = Object.create(states.ing.prototype);
	states.ing.prototype.constructor = states.ing;

	states.ing.prototype.preload = function() {};
	var mask;
	states.ing.prototype.create = function() {
		// var sprite = game.add.sprite(0, 0, 'pic', Phaser.BitmapData);
		// mask = game.add.graphics(0, 0);
		// mask.beginFill(0xffffff);
		// mask.drawCircle(0, 0, 64);
		// sprite.mask = mask;

		var bmd = game.make.bitmapData(320, 568);
		bmd.copy('pic');
		bmd.addToWorld();
		mask = game.make.bitmapData(64, 64);
		mask.circle(32, 32, 32, 'rgba(255, 0, 255, 1)');

		bmd.mask = mask;

		game.input.addPointer();
	};
	states.ing.prototype.update = function() {
		mask.circle(game.input.pointer1.x, game.input.pointer1.y, 32, 'rgba(255, 0, 255, 1)');
		this.check();
	}
	states.ing.prototype.check = function() {

	}

	function ScratchCard(options) {
		this.options = options;
		this.init();
	}

	ScratchCard.prototype = Object.create(ScratchCard.prototype);
	ScratchCard.prototype.constructor = ScratchCard;

	ScratchCard.prototype.init = function() {
		game = Instance.create(320, 568, this.options.domId);
		game.state.add('start', states.start);
		game.state.add('ing', states.ing);
		game.state.add('end', states.end);
		game.state.start('start');
	}
	return ScratchCard;
})