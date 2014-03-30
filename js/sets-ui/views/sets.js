/*global window */
/*jshint nonew:false */

define([
	'no-click-delay',
	'jquery',
	'underscore',
	'thorax',
	'hbs!../templates/sets',
	'v!game/views/board',
	'v!./chrome',
	'v!./end-game'
], function(NoClickDelay, $, _, Thorax, template) {
	"use strict";

	return Thorax.View.extend({
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
