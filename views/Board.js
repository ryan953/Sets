/*global Backbone document */
window.Views = window.Views || {};

window.Views.Board = (function(Parent, Slot) {
	"use strict";

	return Parent.extend({
		tagName: 'div',
		className: 'board',

		child_views: [],

		// Gets a Sets game object in the constructor

		initialize: function() {
			this.model.on('change', this.render, this);
		},

		render: function() {
			var rows = this.model.get('rows'),
				cols = this.model.get('cols');

			this.removeChildren();

			var slots = rows * cols;
			for (var c = 0; c < slots; c++) {
				this.child_views.push(new Slot({
					model: this.model.board.at(c)
				}).render());
			}

			var table = this.make('table');
			for (var row = 0; row < rows; row++) {
				var tr = this.make('tr');
				for (var col = 0; col < cols; col++) {
					var position = (row * cols) + col,
						child = this.child_views[position];
					tr.appendChild(child.el);
				}
				table.appendChild(tr);
			}
			this.el.appendChild(table);

			return this;
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
		}
	});

})(Backbone.View, window.Views.Slot);
