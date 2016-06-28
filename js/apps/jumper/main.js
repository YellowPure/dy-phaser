define(['Phaser', 'common/instance', 'common/loadbar', 'apps/jumper/endpanel'], function(Phaser, Instance, Loadbar, endPanel) {
	var player;
	var platforms;
	var cursors;
	var diamonds;
	var enemys;

	var score = 0;
	var scoreText;
	var stars;
	var game;
	var hearts;
	var gameWidth =  320;
	var gameHeight =  568;

	function Jumper(options) {
		this.options = options;
		this.init();
	}


	var start = function() {

	};
	start.prototype = {
		preload: preload,
		create: create,
		update: update
	}

	Jumper.prototype.init = function() {
		game = Instance.create(320, 568, this.options.domId );
		game.state.add('Start', start);
		game.state.start('Start');
	}
	Jumper.prototype = Object.create(Jumper.prototype);
	Jumper.prototype.constructor = Jumper;

	function deviceResize() {
	    console.log('sourceAspectRatio ', game.scale.sourceAspectRatio );
	    console.log('screenOrientation ', game.scale.screenOrientation );
	    console.log('game.device', game.device);
	    game.stage.backgroundColor = "#eee";
	    // mobile
	    if(!game.device.desktop) {
	    	game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
	    }else {
	    	game.scale.scaleMode = Phaser.ScaleManager.RESIZE;
	    }

        game.scale.pageAlignHorizontally = true;
		game.scale.pageAlignVertically = true;
	}

	function preload() {
		deviceResize();
		Loadbar.init();
		game.load.onLoadStart.add(loadStart, this);
		game.load.onLoadComplete.add(loadComplete, this);
		game.load.onFileComplete.add(fileComplete, this);


		game.load.spritesheet('button', 'js/apps/jumper/assets/button_sprite_sheet.png', 193, 71);

		game.load.image('sky', 'js/apps/jumper/assets/sky.png');
	    game.load.image('ground', 'js/apps/jumper/assets/platform.png');
	    game.load.image('star', 'js/apps/jumper/assets/star.png');
	    game.load.image('diamond', 'js/apps/jumper/assets/diamond.png');
	    game.load.image('heart', 'js/apps/jumper/assets/firstaid.png');

	    game.load.spritesheet('dude', 'js/apps/jumper/assets/dude.png', 32, 48);
	    game.load.spritesheet('enemy', 'js/apps/jumper/assets/baddie.png', 32, 32);

	    Loadbar.show();
	    // game.load.audio('boden', ['.mp3', '.ogg']);
	}

	//	This callback is sent the following parameters:
	function fileComplete(progress, cacheKey, success, totalLoaded, totalFiles) {

		Loadbar.setText(progress, cacheKey, success, totalLoaded, totalFiles);
	}

	function loadStart() {
		console.log('loadStart');
	}

	function loadComplete() {
		console.log('loadComplete');
	}

	function create() {
		Loadbar.hide();
		game.physics.startSystem(Phaser.Physics.ARCADE);

		game.add.sprite(0, 0, 'sky');

		// grounds
		platforms = game.add.group();
		platforms.enableBody = true;

		var ledge = platforms.create(160, 400, 'ground');
		ledge.body.immovable = true;
		ledge.scale.setTo(1, 0.5);

		ledge = platforms.create(-275, 250, 'ground');
		ledge.body.immovable = true;
		ledge.scale.setTo(1, 0.5);

		var ground = platforms.create(0, game.world.height - 64, 'ground');
		ground.scale.setTo(2, 2);
		ground.body.immovable = true;

		// player
		player = game.add.sprite(32, game.world.height - 150, 'dude');

		game.physics.arcade.enable(player);
		player.body.bounce.y = 0.2;
		player.body.gravity.y = 300;
		player.body.collideWorldBounds = true;

		player.animations.add('left', [0, 1, 2, 3], 10, true);
		player.animations.add('right', [5, 6, 7, 8], 10, true);

		// stars
		stars = game.add.group();
		stars.enableBody = true;

		for (var i = 0; i < 10; i++) {
			var star = stars.create(i*35, 0, 'star');
			star.body.gravity.y = 6;
			star.body.bounce.y = 0.7 + Math.random() * 0.2;
		}

		// enemys
		enemys = game.add.group();
		enemys.enableBody = true;

		for (var i = 0; i < 2; i++) {
			var enemy = enemys.create(0, 0, 'enemy');
			enemy.animations.add('left', [0, 1], 5, true);
			enemy.animations.add('right', [2, 3], 5, true);
			enemy.body.gravity.y = 100;
			enemy.body.bounce.y = 0.3 + Math.random() * 0.2;
			if(i == 0) {
				enemy.x = Math.random() * 125;
			}else {
				enemy.x = Math.random() * 160 + 160;
			}
			enemy.body.velocity.x = Math.random() > 0.5? -30: 30;
		}

		// diamonds
		diamonds = game.add.group();
		diamonds.enableBody = true;
		for (var i = 0; i < 2; i++) {
			var diamond = diamonds.create(0, 0, 'diamond');
			diamond.body.gravity.y = 10;
			diamond.body.bounce.y = 0.7 + Math.random() * 0.2;
			if(i == 0) {
				diamond.x = Math.random() * 125;
			}else {
				diamond.x = Math.random() * 160 + 160;
			}
		}

		// scoreText
		scoreText = game.add.text(16, 16, 'score: 0', {fontSize:'32px', fill: '#000'});

		cursors = game.input.keyboard.createCursorKeys();
		// test
		endPanel.init();
		// sprite = game.add.sprite(game.world.centerX, game.world.centerY, 'button');
		// sprite.inputEnabled = true;
		// sprite.events.onInputDown.add(click, null);
	}

	function update() {
		game.physics.arcade.collide(player, platforms);
		game.physics.arcade.collide(stars, platforms);
		game.physics.arcade.collide(diamonds, platforms);
		game.physics.arcade.collide(enemys, platforms);

		game.physics.arcade.overlap(player, diamonds, collectDiamond, null, this);

		game.physics.arcade.overlap(player, stars, collectStar, null, this);
		game.physics.arcade.overlap(player, enemys, gameover, null, this);


		for (var i = 0; i < enemys.children.length; i++) {
			var child = enemys.children[i];
			if(i == 0) {
				if(child.x >= 125 - child.width/2) {
					child.body.velocity.x = -30;
				}
				if(child.x <= 0) {
					child.body.velocity.x = 30;
				}
			}else {
				if(child.x >= gameWidth - child.width) {
					child.body.velocity.x = -30;
				}
				if(child.x <= gameWidth / 2 + child.width/2) {
					child.body.velocity.x = 30;
				}
			}
			if(child.body.velocity.x < 0) {
				child.animations.play('left');
			}else {
				child.animations.play('right');
			}
		}
		
		player.body.velocity.x = 0;

		if(cursors.left.isDown) {
			player.body.velocity.x = -150;
			player.animations.play('left');
		}else if(cursors.right.isDown) {
			player.body.velocity.x = 150;
			player.animations.play('right');
		}else {
			player.animations.stop();
			player.frame = 4;
		}

		if(cursors.up.isDown && player.body.touching.down) {
			player.body.velocity.y -= 300;
		}
	}

	function gameover(player, enemy) {
		// 游戏结束
		console.log('game over');
		player.kill();
		// game.gamePaused();
		endPanel.show();
	}

	function collectDiamond(player, diamond) {
		score += 50;
		scoreText.text = 'score: '+ score;

		diamond.kill();
	}

	function collectStar(player, star) {
		score += 10;
		scoreText.text = 'score: '+ score;

		star.kill();
	}

	return Jumper;
});