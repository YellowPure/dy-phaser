define([
	'apps/jumper/main',
	'apps/redpacket/main',
	'apps/shake/main',
	'apps/scratchCard/main'
], function(Jumper, Redpacket, Shake, ScratchCard) {

	function App(options) {
		console.log('init App',options);
		this.options = options;
		this.init();
	}
	App.prototype = Object.create(App.prototype);
	App.prototype.constructor = App;
	App.prototype.init = function() {
		var gameName = this.options.name;
		var game;
		switch(gameName) {
			case 'jumper':
			game = new Jumper(this.options);
			break;
			case 'redpacket':
			game = new Redpacket(this.options);
			break;
			case 'shake':
			game = new Shake(this.options);
			break;
			case 'scratchCard':
			game = new ScratchCard(this.options);
			break;
			default:
			alert('please set gameName!');
			break;
		}
	};
	return App;
})