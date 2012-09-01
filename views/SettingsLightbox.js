/*global $ _ Backbone document */
window.Views = window.Views || {};

window.Views.SettingsLightbox = (function(Parent) {
	"use strict";

	return Parent.extend({
		tagName: 'div',
		className: 'lightbox hide',

		events: {
		},

		initialize: function() {
			// this.game = this.options.game;

			// this.game.on('game:start', this.render, this);
			// this.game.on('change:foundSets', this.render, this);
			// this.game.settings.on('change:scoreboard-display', this.render, this);

			this.template = _.template($('#tmpl-settingslightbox').text());
		},

		render: function() {
			// var found = this.game.getFoundCardCount(),
			// 	deckSize = this.game.getStartingDeckSize();

			this.$el.html(this.template({}));
			// 	type: this.game.settings.get('scoreboard-display'),
			// 	percent: Math.round(Math.max(found / deckSize * 100, 0)) || 0,
			// 	remaining: deckSize - found,
			// 	found: found,
			// 	deckSize: deckSize
			// }));

			return this;
		}
	});

})(Backbone.View);
