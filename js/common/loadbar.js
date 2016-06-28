define(['Phaser', 'common/instance'], function(Phaser, Instance) {
	var graphics;
	var panel = {
		init: function() {

			var game = Instance.getInstance();
			graphics = game.add.graphics(100, 100);

			graphics.beginFill('0xff0000', 1);
			graphics.drawRect(0, 0, 200, 200);
			graphics.endFill();
		},
		show: function() {
			if(!graphics) {
				this.init();
			}
			graphics.visible = true;
		},
		hide: function() {
			graphics.visible = false;
		}
	}

	return panel;
});