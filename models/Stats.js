/*globals _ Backbone */
window.Models = window.Models || {};

window.Models.Stats = (function(Storage) {
	"use strict";

	return Backbone.Model.extend({
		localStorage: new Storage("stats"),

		defaults: {
			games: {
				start: 0,
				win: 0,
				lose: 0,
				incomplete: 0,
				percent: 0
			},
			time: {
				total: 0,
				average: {
					all: 0,
					win: 0
				},
				shortest: {
					win: 0
				},
				longest: {
					win: 0
				}
			},
			streak: {
				current: {
					count: 0,
					type: ''
				},
				win: 0,
				lose: 0
			},
			cards: {
				zero: 0,
				three: 0,
				six: 0,
				nine: 0,
				more: 0
			}
		},

		initialize: function() {
			this.on('change', function() {
				this.save();
			}, this);

			this.fetch();
		},

		reset: function() {
			this.set(this.defaults);
		}
	});

}(Backbone.LocalStorage));
