require([
	'domReady!',
	'underscore',
	'backbone',
	'backbone/local-storage',
	'routers/game-router',
	'models/stats',
	'models/settings'
], function(doc, _, Backbone, Storage, GameRouter, StatsModel, SettingsModel) {
	"use strict";

	// Mustache Style Templates: {{var}}
	_.templateSettings = {
		interpolate : /\{\{(.+?)\}\}/g,
		evaluate    : /\{%([\s\S]+?)%\}/g,
		escape      : /\{-([\s\S]+?)\}/g
	};

	window.router = new GameRouter({
		rootSelector: 'body',
		stats: new StatsModel({id: 1},
			{localStorage: new Storage("stats")}
		),
		settings: new SettingsModel({id: 1},
			{localStorage: new Storage("settings")}
		)
	});
});