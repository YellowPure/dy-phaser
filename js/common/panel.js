define(['Phaser', 'common/instance'], function(Phaser, Instance) {
	function Panel(game) {
		Phaser.Group.call(this, game);
	};
	Panel.prototype = Object.create(Phaser.Group.prototype);
	Panel.prototype.constructor = Panel;

	Panel.prototype.show = function() {
		this.visible = true;
	}
	Panel.prototype.hide = function() {
		this.visible = false;
	}
	return Panel;
});