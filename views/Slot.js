/*global Backbone */
window.Views = window.Views || {};

window.Views.Slot = (function(Parent, Card) {
	"use strict";

	return Parent.extend({
		tagName: 'td',
		className: 'slot',

		initialize: function() {
			this.model.on('change:card', this.render, this);
		},

		render: function() {
			this.removeChild();

			var card = this.model.get('card');

			if (!_.isEmpty(card)) {
				this.cardView = new Card({
					model: card
				}).render();
				this.el.appendChild(this.cardView.el);
			}

			return this;
		},

		remove: function() {
			Parent.prototype.remove.call(this);

			this.removeChild();
		},

		removeChild: function() {
			if (this.cardView) {
				this.cardView.remove();
				delete this.cardView;
			}
		}
	});

})(Backbone.View, window.Views.Card);
