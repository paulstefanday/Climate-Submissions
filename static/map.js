var forEach = function(array, callback, scope) {
	for (var i = 0; i < array.length; i++) {
		callback.call(scope, i, array[i]); // passes back stuff we need
	}
};

var randomIntFromInterval = function(min,max) {
	return Math.floor(Math.random()*(max-min+1)+min);
}

var $mapPins = document.querySelectorAll('#Map-shape g');

// Setup timelines attached to each map pin
forEach($mapPins, function(index, value) {
	// Group opacity timeline
	value.groupTimeline = new TimelineMax({
		paused: true
	});

	value.groupTimeline
	.to(value, 0.25, {
		opacity: 0
	});

	// Pulse animation
	var pinTimeline = new TimelineMax({
		repeat: -1,
		delay: randomIntFromInterval(1,7),
		repeatDelay: randomIntFromInterval(0, 8)
	});

	pinTimeline.
	to(value.querySelector('.Pin-back'), 3, {
		scale: 50,
		transformOrigin: 'center center',
		opacity: 0
	});
});
