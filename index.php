<!DOCTYPE html>
<html>
<head>

<?php
function css($path) {
	echo sprintf("<link rel=\"stylesheet\" href=\"%s?%d\" type=\"text/css\"/>\n",
		$path, filemtime($path));
}
function js($path) {
	echo sprintf("<script src=\"%s?%d\"></script>\n",
		$path, filemtime($path));
}
?>

<title>Sets!</title>

<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-status-bar-style" content="default" />

<meta name="viewport" content="width=device-width; user-scalable=no; initial-scale=1.0; maximum-scale=1.0;">

<?php
css("./style.css");
css("./board.css");
?>

</head>
<body>

<script type="text/html" id="tmpl-menu">
	<div class="left dropdown ">
		<a href="#options" class="button menubar-button">Sets!</a>
		<div id="options">
			<a href="#" class="button open menubar-button">Sets!</a>
			<ul>
				<li><a href="#show/SettingsLightbox">Settings</a></li>
				<li><a href="#show/StatsLightbox" class="needs-localstorage">Stats</a></li>
				<li><a href="#about">About</a></li>
			</ul>
		</div>
	</div>
	<div class="right menubar-button">
		<a class="button game-reset">Reset</a>
	</div>
	<div class="scoreboard-placeholder"></div>
</script>

<script type="text/html" id="tmpl-scoreboard">
	{% if (type === 'score') { %}
		<a href="#">Deck: {{found}}/{{deckSize}}</a>
	{% } else if (type === 'remaining') { %}
		<a href="#">{{remaining}} cards remaining</a>
	{% } else if (type === 'percent') { %}
		<a href="#">Sets Found: {{percent}}%</a>
	{% } else if (type === 'time') { %}
		<a href="#">Time: <span class="time">0:00</span></a>
	{% } %}
</script>

<script type="text/html" id="tmpl-settingslightbox">
<div>
	<h2>Settings</h2>
	<div>
		<input type="checkbox" id="settings-mode-easy" name="mode" value="easy" />
		<label for="settings-mode-easy">Quick Start</label>
	</div>
	<div>
		<input type="checkbox" id="settings-help-on" name="help" value="on" />
		<label for="settings-help-on">Show Helpful Hints</label>
	</div>
	<div>
		<input type="text" id="settings-invalid-slot-delay" name="invalid-slot-delay" value="3" />
		<label for="settings-invalid-slot-delay">Invalid Slot Animation Delay (seconds)</label>
	</div>
</div>
</script>

<script type="text/html" id="tmpl-statslightbox">
<div>
	<h2>Stats</h2>
	<strong>Games</strong>
	<dl class="table">
		<dt>Games Started</dt><dd>{{ games_start }}</dd>
		<dt>Games Won</dt><dd>{{ games_win }}</dd>
		<dt>Games Lost</dt><dd>{{ games_lose }}</dd>
		<dt>Games Incomplete</dt><dd>{{ games_incomplete }}</dd>
		<dt>Percent Won</dt><dd>{{ games_percent }}</dd>
	</dl>
	<hr/>
	<strong>Time</strong>
	<dl class="table">
		<dt>Total Time Played</dt><dd>{{ time_total }}</dd>
		<dt>Average Game Time</dt><dd>{{ time_average_all }}</dd>
		<dt>Average Win Time</dt><dd>{{ time_average_win }}</dd>
		<dt>Shortest Win Time</dt><dd>{{ time_shortest_win }}</dd>
		<dt>Longest Win Time</dt><dd>{{ time_longest_win }}</dd>
	</dl>
	<hr/>
	<strong>Streaks</strong>
	<dl class="table">
		<dt>Current Streak</dt><dd>{{ streak_current_count }} {{ streak_current_type }}</dd>
		<dt>Longest Win Streak</dt><dd>{{ streak_win }}</dd>
		<dt>Longest Lose Streak</dt><dd>{{ streak_lose }}</dd>
	</dl>
	<hr/>
	<strong>Cards Remaining</strong>
	<dl class="table">
		<dt>No cards left over</dt><dd>{{ cards_zero }}</dd>
		<dt>3 Remaining</dt><dd>{{ cards_three }}</dd>
		<dt>6 Remaining</dt><dd>{{ cards_six }}</dd>
		<dt>9 Remaining</dt><dd>{{ cards_nine }}</dd>
		<dt>more than 9</dt><dd>{{ cards_more }}</dd>
	</dl>
	<a id="stats-reset" class="button"><span>Reset Stats</span></a>
</div>
</script>

<script type="text/html" id="tmpl-sets-view">
<div class="popup hide" id="game-over-win">
	<div>
		<h3>Game Over!</h3>
		<p>You won!</p>
		<a href="#" class="button game-reset"><span>Play Again</span></a>
	</div>
</div>
<div class="popup hide" id="game-over-lose">
	<div>
		<h3>Game Over!</h3>
		<p>No more sets are possible.</p>
		<a href="#" class="button game-reset"><span>Play Again</span></a>
	</div>
</div>
</script>

<div class="lightbox hide" id="help">
	<h2>How to play Sets!</h2>
	<p>blah blah blah</p>
</div>

<div class="lightbox hide" id="about">
	<div>
		<h2>About</h2>
		<p>This webapp was designed and built by <a href="//ryanalbrecht.ca">Ryan Albrecht</a>.</p>
		<p>It works really well on mobile devices and webkit based browsers like Chrome or Safari.
		Specifically, your browser should support the following for the complete experience:</p>
		<ul>
			<li><code>&lt;canvas&gt;</code></li>
			<li>CSS3
				<ul>
					<li>background gradients</li>
					<li><code>border-radius</code></li>
					<li><code>box-sizing</code></li>
					<li><code>-webkit-transform</code></li>
					<li><code>@media</code> queries</li>
					<li><code>@-webkit-keyframes</code> animations</li>
				</ul>
			</li>
			<li>JavaScript 1.6
				<ul>
					<li><code>Array.prototype.forEach()</code></li>
					<li><code>Array.prototype.reduce()</code></li>
				</ul>
			</li>
			<li>Localstorage</li>
		</ul>

		<p>See <a href="http://setgame.com/set/">http://setgame.com/set/</a> for more information.</p>
		<a href="#" class="right button lightbox-close">Close</a>
	</div>
</div>

<?php
js("./lib/jquery-1.7.2.min.js");
js("./lib/underscore-1.4.2.min.js");
js("./lib/backbone-0.9.2.min.js");

js("./lib/NoClickDelay.js");
js("./lib/event.js");
js("./lib/jintervals-0.7-min.js");
// js("./lib/modernizr-2.5.3-custom-build.js");

js("./lib/backbone.localStorage.js");

js("./models/Settings.js");
js("./models/Stats.js");
js("./models/Card.js");
js("./models/Slot.js");
js("./collections/Deck.js");
js("./collections/Board.js");
js("./models/Sets.js");

js("./views/bases/ParentView.js");
js("./views/bases/LightboxView.js");
js("./views/Card.js");
js("./views/Slot.js");
js("./views/Board.js");
js("./views/EndGame.js");

js("./views/Scoreboard.js");
js("./views/Menubar.js");
js("./views/SettingsLightbox.js");
js("./views/StatsLightbox.js");
js("./views/Chrome.js");

js("./views/Sets.js");

js("./routers/GameRouter.js");
?>

<script>
"use strict";
new NoClickDelay(document.getElementsByTagName('body')[0]);

$(document).ready(function() {
	// Mustache Style Templates: {{var}}
	_.templateSettings = {
		interpolate : /\{\{(.+?)\}\}/g,
		evaluate    : /\{%([\s\S]+?)%\}/g,
	};

	window.settings = new Models.Settings({id: 1});

	window.router = new GameRouter({
		$root: $('body'),
		settings: window.settings
	});
});
</script>

<script>
	"use strict";
	var _gaq = _gaq || [];
	_gaq.push(['_setAccount', 'UA-24049225-1']);
	_gaq.push(['_trackPageview']);

	(function() {
		var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
		ga.src = 'https://ssl.google-analytics.com/ga.js';
		var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
	})();
</script>

</body>
</html>
