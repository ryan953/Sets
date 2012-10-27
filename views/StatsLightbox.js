/*global $ _ Backbone document */
window.Views = window.Views || {};

window.Views.StatsLightbox = (function(Parent) {
	"use strict";

	return Parent.extend({
		tagName: 'div',
		className: 'lightbox hide',

		events: {
			'click #stats-reset': 'resetStats'
		},

		initialize: function() {
			this.game = this.options.game;
			this.stats = this.game.stats;

			this.stats.on('change', this.render, this);

			this.template = _.template($('#tmpl-statslightbox').text());
		},

		render: function() {
			this.$el.html(this.template(this.stats.toJSON()));
			this.addCloseButton();
			return this;
		},

		remove: function() {
			Parent.prototype.remove.call(this);
			this.stats.off('change', this.render, this);
		},

		resetStats: function(e) {
			this.stats.reset();
		}
	});

})(window.Views.Bases.LightboxView);
