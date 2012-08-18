/*global $ _ Backbone document */
window.Views = window.Views || {};

window.Views.Scoreboard = (function(Parent) {
	"use strict";

	return Parent.extend({
		tagName: 'div',
		className: '',

		events: {
			'click [data-scoreboard-display]': function() {
				this.settings.setNextScoreboardDisplay();
			}
		},

		initialize: function() {
			this.settings = this.options.settings;

			this.settings.on('change:scoreboard-display', this.renderScore, this);

			this.template = _.template($('#tmpl-scoreboard').text());
		},

		render: function() {
			this.$el.html(this.template());
			this.renderScore();

			return this;
		},

		renderScore: function() {
			var boardName = this.settings.get('scoreboard-display');
			console.log('renderScore', boardName);
			this.$('[data-scoreboard-display]').hide()
				.filter('[data-scoreboard-display='+boardName+']').show();
		}
	});

})(Backbone.View);
