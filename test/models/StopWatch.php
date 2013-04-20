<!DOCTYPE html>
<html>
<head>
<title>Test: collections/Deck.js</title>

<link href="../../lib/qunit.css" rel="stylesheet" type="text/css" media="screen" />
<script src="../../lib/qunit.js"></script>
<script src="../../lib/jquery.min.js"></script>
<script src="../../lib/underscore.min.js"></script>
<script src="../../lib/backbone.min.js"></script>

<script src="../../lib/sinon.js"></script>
<script src="../../lib/sinon-qunit.js"></script>

<script src="../../models/StopWatch.js"></script>

<script>
"use strict";

$(document).ready(function () {
	module('StopWatch', {
		setup: function() {
			this.wait = 7; // time in seconds to wait during this test

			this.tick = function() {
				this.clock.tick(this.wait * 1000);
			};
		}
	});

	test('watch can be started and stopped', function() {
		var watch = new StopWatch();

		equal(watch.state(), StopWatch.PAUSED, 'starts paused');

		watch.pause();
		equal(watch.state(), StopWatch.PAUSED, 'calling pause keeps it paused');

		watch.start();
		equal(watch.state(), StopWatch.COUNTING, 'can be turned on');

		watch.start();
		equal(watch.state(), StopWatch.COUNTING, 'calling start keep is on');

		watch.pause();
		equal(watch.state(), StopWatch.PAUSED, 'can be paused again');
	});

	test('returns zero second when created', function() {
		var watch = new StopWatch();

		equal(watch.state(), StopWatch.PAUSED, 'is paused');
		equal(watch.milliseconds(), 0, 'should have zero time so far');
		watch.reset();
		equal(watch.milliseconds(), 0, 'should have zero after hitting reset');
	});

	test('paused counts no time', function() {
		var watch = new StopWatch();

		equal(watch.seconds(), 0);

		this.tick();

		equal(watch.seconds(), 0);
	});

	test('can start the clock and wait some time', function() {
		var watch = new StopWatch();

		watch.start();

		this.tick();

		equal(watch.milliseconds(), this.wait * 1000);
		equal(watch.seconds(), this.wait);
	});

	test('can start the clock, pause, and wait some time', function() {
		var watch = new StopWatch();

		watch.start();

		this.tick();

		watch.pause();
		equal(watch.seconds(), this.wait);
		equal(watch.state(), StopWatch.PAUSED);

		this.tick();

		equal(watch.seconds(), this.wait, 'time should not have been counted');
		equal(watch.state(), StopWatch.PAUSED);

		this.tick();
	});

	test('can start the clock, reset, and wait some time', function() {
		var watch = new StopWatch();

		watch.start();

		this.tick();

		equal(watch.seconds(), this.wait);
		equal(watch.state(), StopWatch.COUNTING);

		watch.reset();

		this.tick();

		equal(watch.seconds(), this.wait, 'time should have been restarted');
		equal(watch.state(), StopWatch.COUNTING);
	});

	test('can start and pause a few times and sum all time', function() {
		var watch = new StopWatch();

		watch.start();

		this.tick(); // will get counted

		equal(watch.seconds(), this.wait);

		watch.pause();
		this.tick(); // will not count
		watch.start();
		this.tick(); // will get counted
		this.tick(); // will get counted
		watch.pause();
		this.tick(); // will not count

		equal(watch.seconds(), this.wait * 3, 'should have counted two segments');
	});
});
</script>

</head>
<body>
	<div id="qunit"></div>
	<div id="qunit-fixture">test markup, will be hidden</div>
</body>
</html>
