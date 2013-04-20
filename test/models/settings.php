<!DOCTYPE html>
<html>
<head>
<title>Test: models/Settings.js</title>

<link href="../../lib/qunit.css" rel="stylesheet" type="text/css" media="screen" />
<script src="../../lib/qunit.js"></script>
<script src="../../lib/jquery.min.js"></script>
<script src="../../lib/underscore.min.js"></script>
<script src="../../lib/backbone.min.js"></script>

<script src="../../lib/backbone.localStorage.js"></script>

<script src="../../models/Settings.js"></script>

<script>
"use strict";

$(document).ready(function () {
	var bindSave = function(settings, func) {
		settings.save = func;
		settings.initialize(settings.attrs,
			{localStorage: settings.localStorage}
		);
	};

	module('Settings', {
		setup: function() {
			this.settings = new window.Models.Settings({id:'qunit-test'},
				{localStorage: new Backbone.LocalStorage('test')}
			);
			bindSave(this.settings, function() { /* no op */ });
		},
		teardown: function() {
			localStorage.removeItem('settings-qunit-test');
		}
	});

	test('is backed by localStore', function() {
		ok(this.settings.localStorage);
	});

	test('auto-saves on update', function() {
		bindSave(this.settings, function() {
			ok(true, 'saved');
		});
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
