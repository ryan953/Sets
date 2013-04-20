<!DOCTYPE html>
<html>
<head>
<title>Test: models/Clock.js</title>

<link href="../../lib/qunit.css" rel="stylesheet" type="text/css" media="screen" />
<script src="../../lib/qunit.js"></script>
<script src="../../lib/jquery.min.js"></script>
<script src="../../lib/underscore.min.js"></script>
<script src="../../lib/backbone.min.js"></script>

<script src="../../models/Clock.js"></script>

<script>
"use strict";

$(document).ready(function () {
	module('Clock', {
		setup: function() {
			this.delay = 50;
		}
	});

	test('clock triggers event on start', function() {
		var clock = new Clock({}, {
			tickAction: function() {
				return false;
			},
			delay: this.delay
		});
		expect(1);
		stop(1);

		clock.on('clock.start', function() {
			ok(true, 'clock.start event caught');
			start();
		});
		clock.start();
	});

	test('clock triggers event on stop', function() {
		var clock = new Clock({}, {
			tickAction: function() {
				return false;
			},
			delay: this.delay
		});
		expect(1);
		stop(1);

		clock.on('clock.stop', function() {
			ok(true, 'clock.stop event caught');
			start();
		});
		clock.start();
	});

	test('clock ticks 3 times', function() {
		var count = 3,
			clock = new Clock({}, {
				tickAction: function() {
					ok(true, 'Clock tick ' + count);
					start();
					return count--;
				},
				delay: this.delay
			});
		expect(count);
		stop(count);

		clock.start();
	});

	test('clock can be stopped early', function() {
		var count = 3,
			clock = new Clock({}, {
				tickAction: function() {
					ok(false, 'Should not have a chance to tick');
					return count--;
				},
				delay: this.delay
			});
		expect(2);
		stop(1);

		clock.on('clock.start', function() {
			ok(true, 'clock.start event caught');
		});
		clock.on('clock.stop', function() {
			ok(true, 'clock.stop event caught');
			start();
		});
		clock.start();
		clock.stop();
	});
});
</script>

</head>
<body>
	<div id="qunit"></div>
	<div id="qunit-fixture">test markup, will be hidden</div>
</body>
</html>
