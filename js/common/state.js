define([], function() {
	var State = function() {

	};
	State.prototype = Object.create(State.prototype);
	State.prototype.constructor = State;
	State.prototype.update = function() {

	};
	State.prototype.create = function() {

	};
	State.prototype.preload = function() {
		console.log('parent');
	};
	return State;
});