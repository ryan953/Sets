<!DOCTYPE html>
<html>
<head>

<?php
function __autoload($className) {
	$fileName = str_replace('_', '/', $className);
    include './classes/' . $fileName . '.php';
}

$assetbuilder = AssetBuilder::factory();
$css = new Cache_CSS($assetbuilder);
$js = new Cache_JS($assetbuilder);
$templateBuilder = new AssetBuilder_JSTemplate();
$tmpl = new Cache_JSTemplate($templateBuilder);

// CSS Building
$css("./css/style.css");
$css("./css/board.css");
$css("./css/lightbox.css");
$css("./css/button.css");
$css("./css/menubar.css");
$css("./css/dropdown.css");
$css("./css/table.css");

// JS Building
$js("./lib/NoClickDelay.js");
$js("./lib/jquery.min.js");
$js("./lib/underscore.min.js");
$js("./lib/backbone.min.js");
$js("./lib/moment.min.js");
$js("./lib/backbone.localStorage.js");

$js("./models/Clock.js");
$js("./models/StopWatch.js");

$js("./models/Settings.js");
$js("./models/Stats.js");
$js("./models/Card.js");
$js("./models/Slot.js");
$js("./collections/Deck.js");
$js("./collections/Board.js");

$js("./models/Matcher.js");
$js("./models/FoundSets.js");

$js("./models/Sets.js");

$js("./views/bases/ParentView.js");
$js("./views/bases/LightboxView.js");
$js("./views/Card.js");
$js("./views/Slot.js");
$js("./views/Board.js");
$js("./views/EndGame.js");

$js("./views/Scoreboard.js");
$js("./views/Menubar.js");
$js("./views/SettingsLightbox.js");
$js("./views/StatsLightbox.js");
$js("./views/Chrome.js");

$js("./views/Sets.js");

$js("./routers/GameRouter.js");

$tmpl("./templates/tmpl-menu.template");
$tmpl("./templates/tmpl-scoreboard.template");
$tmpl("./templates/tmpl-settingslightbox.template");
$tmpl("./templates/tmpl-statslightbox.template");
$tmpl("./templates/tmpl-game-over.template");
?>

<title>Sets!</title>

<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-status-bar-style" content="default" />

<meta name="viewport" content="width=device-width; user-scalable=no; initial-scale=1.0; maximum-scale=1.0;">

<?php echo $css; ?>

</head>
<body>

<?php echo $tmpl; ?>

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

<?php echo $js; ?>

<script>
"use strict";

$(document).ready(function() {
	// Mustache Style Templates: {{var}}
	_.templateSettings = {
		interpolate : /\{\{(.+?)\}\}/g,
		evaluate    : /\{%([\s\S]+?)%\}/g,
		escape      : /\{-([\s\S]+?)\}/g
	};

	window.router = new GameRouter({
		rootSelector: 'body',
		stats: new Models.Stats({id: 1},
			{localStorage: new Backbone.LocalStorage("stats")}
		),
		settings: new Models.Settings({id: 1},
			{localStorage: new Backbone.LocalStorage("settings")}
		)
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
