require([
	'domReady!',
	'underscore',
	'backbone',
	'backbone/local-storage',
	'sets-ui/routers/game-router',
	'game/models/stats',
	'game/models/settings'
], function(doc, _, Backbone, Storage, GameRouter, StatsModel, SettingsModel) {
	"use strict";

	// Mustache Style Templates: {{var}}
	_.templateSettings = {
		interpolate : /\{\{(.+?)\}\}/g,
		evaluate    : /\{%([\s\S]+?)%\}/g,
		escape      : /\{-([\s\S]+?)\}/g
	};

	new GameRouter({
		rootSelector: 'body',
		stats: new StatsModel({id: 1},
			{localStorage: new Storage("stats")}
		),
		settings: new SettingsModel({id: 1},
			{localStorage: new Storage("settings")}
		)
	}).startHistory();
});
