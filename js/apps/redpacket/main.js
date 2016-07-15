define(['Phaser', 'common/instance', 'common/loadbar', 'common/endpanel'], function(Phaser, Instance, Loadbar, EndPanel) {
	var game;
	var limitTime;
	var callbacks = { };
	function RedPacket(options) {
		this.options = options;
		limitTime = this.options.limit.time || null;
		this.init();
		callbacks = options.result;
	}

	var States = {};

	/**
	*	三种状态 init初始化，开始游戏状态，游戏结束状态
	*/
	States.init = function() {};
	States.init.prototype = Object.create(States.init.prototype);
	States.init.prototype.constructor = States.init;
	States.init.prototype = {
		preload: function() {
			game.stage.backgroundColor = "#eee";
		    // mobile
		    if(!game.device.desktop) {
		    	game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
		    }else {
		    	game.scale.scaleMode = Phaser.ScaleManager.RESIZE;
		    }

	        game.scale.pageAlignHorizontally = true;
			game.scale.pageAlignVertically = true;

			Loadbar.init();
			game.load.onLoadStart.add(loadStart, this);
			game.load.onLoadComplete.add(loadComplete, this);
			game.load.onFileComplete.add(fileComplete, this);

			game.load.image('sky', 'js/apps/redpacket/assets/sky.png');
			game.load.image('redpacket', 'js/apps/redpacket/assets/diamond.png');
			game.load.spritesheet('player', 'js/apps/redpacket/assets/dude.png', 32, 48);
			game.load.spritesheet('button', 'js/apps/redpacket/assets/button_sprite_sheet.png', 193, 71);

			Loadbar.show();

		},
		create: function() {
			Loadbar.hide();

			var button = game.add.button(game.world.centerX - 95, game.world.centerY, 'button', this.gameStart, this, 2, 1, 0);
			button.inputEnabled = true;

			// button.events.onInputDown.add(this.gameStart, this);
			console.log('game create');
		},
		gameStart: function() {
			game.state.start('Start');
		},
		update: function() {

		}
	}

	States.start = function() {

	};

	States.start.prototype = Object.create(States.start.prototype);
	States.start.prototype.constructor = States.start;

	var redpackets;
	var score;
	var scoreText;
	var timeCounter;
	States.start.prototype = {
		preload: function() {

		},
		create: function() {

			score = 0;
			timeCounter = 0;

			game.physics.startSystem(Phaser.Physics.ARCADE);

			game.add.sprite(0, 0, 'sky');
			var player = game.add.sprite(game.world.centerX - 16, game.world.height - 48, 'player');
			this.player = player;
			game.physics.arcade.enable(player);
			player.body.collideWorldBounds = true;
			player.animations.add('left', [0, 1, 2, 3], 10, true);
			player.animations.add('right', [5, 6, 7, 8], 10, true);

			scoreText = game.add.text(16, 16, 'score: 0', {fontSize:'32px', fill: '#000'});

			redpackets = game.add.group();
			redpackets.enableBody = true;

			game.time.events.loop(Phaser.Timer.SECOND * 1, this.fadePack, this);
			game.input.onUp.add(function() {
				console.log('onUp callback');
			});
			game.input.onTap.add(function() {
				console.log('onTap');
			});
			game.input.onDown.add(function() {
				console.log('onDown');
			});
			game.input.onHold.add(function() {
				console.log('onHold');
			});
			game.input.moveCallback = function(pointer, x, y) {
				console.log('move callback');
			};

			game.input.addPointer();
			// end time
			// game.time.events.add(Phaser.Timer.SECOND, this.updateTime, this);
			game.time.events.loop(Phaser.Timer.SECOND, this.checkGameOver, this);
			this.timeText = game.add.text(game.width - 100, 16, 'time: '+ limitTime, {fontSize:'32px', fill:'#000'});
		},
		checkGameOver: function() {
			timeCounter++;
			this.timeText.text = 'time: '+ (limitTime - timeCounter);
			if(timeCounter> limitTime) {
				callbacks.win(score);
				game.state.start('End');
			}
			// alert('game over!');
		},
		onTouchStart: function() {
			console.log(arguments);
			// console.log(pointer, x, y);
		},
		update: function() {
			this.player.x = game.input.pointer1.x;
			game.physics.arcade.overlap(this.player, redpackets, this.scoreUpdate);
		},
		render: function() {
			// game.debug.pointer(game.input.mousePointer);
			// game.debug.pointer(game.input.pointer1);
			game.debug.text(game.time.events.duration, 32, 32);
		},
		scoreUpdate: function(player, redpacket) {
			score +=redpacket.score;
			scoreText.text = 'score: '+ score;
			redpacket.kill();
		},
		fadePack: function() {
			console.log('new pack');
			var randomX = Math.random() * game.world.width;
			var p = redpackets.create(randomX, 0, 'redpacket');
			p.body.immovable = true;
			p.body.gravity.y = 100;

			p.score = getRandomScore();

			redpackets.add(p);
		}
	}

	function getRandomScore() {
		var scores = [10, 20, 50, 100];
		var index = Math.floor(Math.random()*scores.length);
		return scores[index];
	}

	States.end = function() {

	};

	States.end.prototype = Object.create(States.end.prototype);
	States.end.prototype.constructor = States.end;
	States.end.prototype = {
		preload: function() {

		},
		create: function() {
			console.log('end state');
			var endpanel = new EndPanel(game);
		},
		update: function() {

		}
	}

	function loadStart() {

	}

	function fileComplete(progress, cacheKey, success, totalLoaded, totalFiles) {
		Loadbar.setText(progress, cacheKey, success, totalLoaded, totalFiles);
	}

	function loadComplete() {

	}

	RedPacket.prototype = Object.create(RedPacket.prototype);
	RedPacket.prototype.constructor = RedPacket;

	RedPacket.prototype.init = function() {
		console.log('redpacket init');
		game = Instance.create(320, 568, this.options.domId );
		game.state.add('Init', States.init);
		game.state.add('Start', States.start);
		game.state.add('End', States.end);
		game.state.start('Init');
	}

	return RedPacket;
});