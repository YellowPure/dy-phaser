define(['Phaser', 'common/instance'], function(Phaser, Instance) {
	var panel = {
		init: function() {

			var game = Instance.getInstance();
			text = game.add.text(0, game.world.centerY, '', {fill: '#000000', font:'16px'});
		},
		show: function() {
			text.visible = true;
		},
		setText: function(progress, cacheKey, success, totalLoaded, totalFiles) {
			text.setText("File Complete: " + progress + "% - " + totalLoaded + " out of " + totalFiles);
		},
		hide: function() {
			text.visible = false;
		}
	}

	return panel;
});