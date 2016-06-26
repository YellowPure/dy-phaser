define(['Phaser'], function(Phaser) {
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

	function init() {
		game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });
	}

	function preload() {
		game.load.image('sky', 'assets/sky.png');
	    game.load.image('ground', 'assets/platform.png');
	    game.load.image('star', 'assets/star.png');
	    game.load.image('diamond', 'assets/diamond.png');
	    game.load.image('heart', 'assets/firstaid.png');

	    game.load.spritesheet('dude', 'assets/dude.png', 32, 48);
	    game.load.spritesheet('enemy', 'assets/baddie.png', 32, 32);

	    // game.load.audio('boden', ['.mp3', '.ogg']);
	}

	function create() {
		game.physics.startSystem(Phaser.Physics.ARCADE);

		game.add.sprite(0, 0, 'sky');

		// grounds
		platforms = game.add.group();
		platforms.enableBody = true;

		var ledge = platforms.create(400, 400, 'ground');
		ledge.body.immovable = true;

		ledge = platforms.create(-150, 250, 'ground');
		ledge.body.immovable = true;

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

		for (var i = 0; i < 12; i++) {
			var star = stars.create(i*70, 0, 'star');
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
				enemy.x = Math.random() * 250;
			}else {
				enemy.x = Math.random() * 400 + 400;
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
				diamond.x = Math.random() * 250;
			}else {
				diamond.x = Math.random() * 400 + 400;
			}
		}

		// scoreText
		scoreText = game.add.text(16, 16, 'score: 0', {fontSize:'32px', fill: '#000'});

		cursors = game.input.keyboard.createCursorKeys();
	}

	function turnback() {

	}

	function update() {
		game.physics.arcade.collide(player, platforms);
		game.physics.arcade.collide(stars, platforms);
		game.physics.arcade.collide(diamonds, platforms);
		game.physics.arcade.collide(enemys, platforms);

		game.physics.arcade.overlap(player, diamonds, collectDiamond, null, this);

		game.physics.arcade.overlap(player, stars, collectStar, null, this);
		game.physics.arcade.overlap(player, enemys, hit, null, this);


		for (var i = 0; i < enemys.children.length; i++) {
			var child = enemys.children[i];
			if(i == 0) {
				if(child.x >= 250 - child.width/2) {
					child.body.velocity.x = -30;
				}
				if(child.x <= 0) {
					child.body.velocity.x = 30;
				}
			}else {
				if(child.x >= 800 - child.width) {
					child.body.velocity.x = -30;
				}
				if(child.x <= 400 + child.width/2) {
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

	function hit(player, enemy) {
		player.kill();
		alert('game over + score: ' + score);
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

	return {
		init: init
	};
});