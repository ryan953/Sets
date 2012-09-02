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

<script type="text/html" id="tmpl-menu">
	<div class="left dropdown">
		<a href="#options" class="button"><span>Sets!</span></a>
		<div id="options">
			<a href="#" class="button open"><span>Sets!</span></a>
			<ul>
				<li><a href="#show/SettingsLightbox">Settings</a></li>
				<li><a href="#show/Stats" class="needs-localstorage">Stats</a></li>
				<li><a href="#show/About">About</a></li>
			</ul>
		</div>
	</div>
	<div class="right">
		<a class="button game-reset"><span>Reset</span></a>
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
	<h2>Settings</h2>
	<div>
		<input type="checkbox" id="settings-easy-mode" name="easy-mode" value="easy" />
		<label for="settings-easy-mode">Quick Start</label>
	</div>
	<div>
		<input type="checkbox" id="settings-help-mode" name="help-mode" value="on" />
		<label for="settings-help-mode">Show Helpful Hints</label>
	</div>
</script>

<div class="lightbox hide" id="stats">
	<h2>Stats</h2>
	<strong>Games</strong>
	<dl class="table">
		<dt>Games Started</dt><dd data-stat="games-start">0</dd>
		<dt>Games Won</dt><dd data-stat="games-win">0</dd>
		<dt>Games Lost</dt><dd data-stat="games-lose">0</dd>
		<dt>Games Incomplete</dt><dd data-stat="games-incomplete">0</dd>
		<dt>Percent Won</dt><dd data-stat="games-percent">0</dd>
	</dl>
	<hr/>
	<strong>Time</strong>
	<dl class="table">
		<dt>Total Time Played</dt><dd data-stat="time-total">0:00</dd>
		<dt>Average Game Time</dt><dd data-stat="time-average">0:00</dd>
		<dt>Average Win Time</dt><dd data-stat="time-average-win">0:00</dd>
		<dt>Shortest Win Time</dt><dd data-stat="time-shortest-win">0:00</dd>
		<dt>Longest Win Time</dt><dd data-stat="time-longest-win">0:00</dd>
	</dl>
	<hr/>
	<strong>Streaks</strong>
	<dl class="table">
		<dt>Current Streak</dt><dd data-stat="streak-current">0 wins</dd>
		<dt>Longest Win Streak</dt><dd data-stat="streak-win">0</dd>
		<dt>Longest Lose Streak</dt><dd data-stat="streak-lose">0</dd>
	</dl>
	<hr/>
	<strong>Cards Remaining</strong>
	<dl class="table">
		<dt>No cards left over</dt><dd data-stat="cards-0">0</dd>
		<dt>3 Remaining</dt><dd data-stat="cards-3">0</dd>
		<dt>6 Remaining</dt><dd data-stat="cards-6">0</dd>
		<dt>9 Remaining</dt><dd data-stat="cards-9">0</dd>
		<dt>more than 9</dt><dd data-stat="cards-more">0</dd>
	</dl>
	<a id="stats-reset" class="button"><span>Reset Stats</span></a>
</div>

<div class="lightbox hide" id="help">
	<h2>How to play Sets!</h2>
	<p>blah blah blah</p>
</div>

<div class="lightbox hide" id="about">
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
</div>

<div class="popup" id="game-over-win">
	<h3>Game Over!</h3>
	<p>You won!</p>
	<a href="#" class="button game-reset"><span>Play Again</span></a>
</div>
<div class="popup" id="game-over-lose">
	<h3>Game Over!</h3>
	<p>You didn't win this time.</p>
	<a href="#" class="button game-reset"><span>Play Again</span></a>
</div>

<?php
js("./lib/jquery-1.7.2.min.js");
js("./lib/underscore-1.3.3.min.js");
js("./lib/backbone-0.9.2.min.js");

js("./lib/NoClickDelay.js");
js("./lib/event.js");
js("./lib/jintervals-0.7-min.js");
// js("./lib/modernizr-2.5.3-custom-build.js");

js("./lib/backbone.localStorage.js");

js("./models/Settings.js");
js("./models/Card.js");
js("./models/Slot.js");
js("./collections/Deck.js");
js("./collections/Board.js");
js("./models/Sets.js");

js("./views/bases/ParentView.js");
js("./views/Card.js");
js("./views/Slot.js");
js("./views/Board.js");

js("./views/Scoreboard.js");
js("./views/Menubar.js");
js("./views/SettingsLightbox.js");
js("./views/Chrome.js");

js("./views/Sets.js");

js("./routers/Lightboxes.js");
?>

<script>
_.each(document.getElementsByClassName('board'), function(elem) {
	elem.ontouchmove = function(e) { e.preventDefault(); };
});
new NoClickDelay(document.getElementsByTagName('body')[0]);

$(document).ready(function() {
	// Mustache Style Templates: {{var}}
	_.templateSettings = {
		interpolate : /\{\{(.+?)\}\}/g,
		evaluate    : /\{%([\s\S]+?)%\}/g,
	};

	window.router = new Router({
		$root: $('body')
	});
});
</script>
</body>
</html>
