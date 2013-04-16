/*global confirm, $ _ Backbone document */
window.Views = window.Views || {};

window.Views.StatsLightbox = (function(Parent) {
	"use strict";

	return Parent.extend({
		events: {
			'click #stats-reset': 'resetStats'
		},

		initialize: function() {
			this.game = this.options.game;
			this.stats = this.game.stats;

			this.listenTo(this.stats, 'change', this.render);

			this.template = _.template($('#tmpl-statslightbox').text());
		},

		render: function() {
			this.$el.html(this.template(this.stats.toJSON()));
			this.addCloseButton();

			this.afterRender();
			return this;
		},

		remove: function() {
			Parent.prototype.remove.call(this);
		},

		resetStats: function(e) {
			var messages = [
				"Are you sure you want all the current stats to be reset?",
				"",
				"This operation cannot be undone."
			];
			if (confirm(messages.join("\n"))) {
				this.stats.reset();
			}
		}
	});

})(window.Views.Bases.LightboxView);
