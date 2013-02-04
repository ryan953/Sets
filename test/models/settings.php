<!DOCTYPE html>
<html>
<head>
<title>Test: clock.js</title>
<link rel="stylesheet" href="../../lib/qunit.css" type="text/css" media="screen" />
<script src="../../lib/jquery-1.7.2.min.js"></script>
<script src="../../lib/qunit.js"></script>
<script src="../../lib/underscore-1.4.2.min.js"></script>
<script src="../../lib/backbone-0.9.10.min.js"></script>
<script src="../../lib/backbone.localStorage.js"></script>

<script src="../../models/Settings.js"></script>

<script>
"use strict";

$(document).ready(function () {
	module('Settings', {
		setup: function() {
			this.settings = new window.Models.Settings();
			this.settings.save = function() { /* no op */ };
		}
	});

	test('is backed by localStore', function() {
		ok(this.settings.localStorage);
	});

	test('auto-saves on update', function() {
		this.settings.save = function() {
			ok(true, 'saved');
			start();
		};
		expect(1);
		stop();
		this.settings.set({foo: 'bar'});
	});

	test('setNextScoreboardDisplay cycles through all types', function() {
		equal(this.settings.get('scoreboard-display'), 'score');
		this.settings.setNextScoreboardDisplay();
		equal(this.settings.get('scoreboard-display'), 'remaining');
		this.settings.setNextScoreboardDisplay();
		equal(this.settings.get('scoreboard-display'), 'percent');
		this.settings.setNextScoreboardDisplay();
		equal(this.settings.get('scoreboard-display'), 'time');
		this.settings.setNextScoreboardDisplay();
		equal(this.settings.get('scoreboard-display'), 'score');
	});

});
</script>

</head>
<body>
	<div id="qunit"></div>
	<div id="qunit-fixture">test markup, will be hidden</div>
</body>
</html>
