/*global window */
/*jshint nonew:false */

define([
	'no-click-delay',
	'jquery',
	'underscore',
	'view',
	'hbs!../templates/sets',
	'v!game/views/board',
	'v!./chrome',
	'v!./end-game'
], function(NoClickDelay, $, _, View, template) {
	"use strict";

	return View.extend({
		tagName: 'div',
		className: 'sets-game',

		template: template,

		initialize: function() {
			var game = this.game;

			$(window).blur(
				_.bind(game.pause, game)
			).focus(
				_.bind(game.resume, game)
			);

			new NoClickDelay(this.el);
		}
	});

});
