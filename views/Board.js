/*global Backbone document */
window.Views = window.Views || {};

window.Views.Board = (function(Parent, Slot) {
	"use strict";

	return Parent.extend({
		tagName: 'div',
		className: 'board',

		child_views: [],

		MAX_COLS: 3,

		initialize: function() {
			this.board = this.options.board;
			this.board.on('reset', this.render, this);
		},

		render: function() {
			this.removeChildren();
			this.renderGameTable();

			return this;
		},

		renderGameTable: function() {
			for (var c = 0; c < this.board.length; c++) {
				this.child_views.push(new Slot({
					slot: this.board.at(c)
				}).render());
			}

			var table = this.make('table'),
				rows = Math.ceil(this.board.length / this.MAX_COLS);
			for (var row = 0; row < rows; row++) {
				var tr = this.make('tr');
				for (var col = 0; col < this.MAX_COLS; col++) {
					var position = (row * this.MAX_COLS) + col,
						child = this.child_views[position];
					tr.appendChild(child.el);
				}
				table.appendChild(tr);
			}
			this.el.appendChild(table);
		},

		remove: function() {
			Parent.prototype.remove.call(this);
			this.removeChildren();
		},

		removeChildren: function() {
			_.each(this.child_views, function(view) {
				view.remove();
			});
			this.child_views = [];
			this.$el.empty();
		}
	});

})(Backbone.View, window.Views.Slot);
