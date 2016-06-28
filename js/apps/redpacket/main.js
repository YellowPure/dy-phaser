define(['Phaser', 'common/instance', 'common/loadbar', 'common/endpanel', 'common/panel'], function(Phaser, Instance, Loadbar, EndPanel, Panel) {
	var game;
	function RedPacket(options) {
		this.options = options;
		this.init();
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
	var score = 0;
	var scoreText;

	States.start.prototype = {
		preload: function() {

		},
		create: function() {
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
			document.addEventListener('touchstart', function() {
				console.log('dom touchstart');
			});
			document.addEventListener('touchend', function() {
				console.log('dom touchend');
			});
			var self = this;
			document.addEventListener('touchmove', function(event) {
				var touches = event.touches;
				var canvas = document.getElementById('phaser-game');
				var rect = canvas.getBoundingClientRect();
				if(touches.length == 1) {
					// console.log(game.input.x);
					// console.log(game.input.y);
					var pos = game.world.toGlobal({
						x:touches[0].clientX - rect.left,
						y:touches[0].clientY - rect.top
					})
					self.player.x = pos.x;
				}
			});
			// game.input.pointer.add(game, 1, Phaser.PointerMode.TOUCH);
			// game.input.addPointer();
			// game.input.multiInputOverride = Phaser.Input.TOUCH_OVERRIDES_MOUSE;
			// game.input.onHold.add(this.onTouchStart, this);
			// game.input.onTap.add(this.onTouchStart);
		},
		onTouchStart: function() {
			console.log(arguments);
			// console.log(pointer, x, y);
		},
		update: function() {
			// console.debug(game.input.pointer1);

			// this.player.x = game.input.mousePointer.x;
			// this.player.rotation = game.physics.arcade.angleToPointer(this.player);
			// console.log(game.input.mousePointer);
			game.physics.arcade.overlap(this.player, redpackets, this.scoreUpdate);
		},
		render: function() {
			game.debug.pointer(game.input.mousePointer);
			game.debug.pointer(game.input.pointer1);
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