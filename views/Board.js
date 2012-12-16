/*global document */
window.Views = window.Views || {};

window.Views.Board = (function(Parent, SlotView) {
	"use strict";

	return Parent.extend({
		tagName: 'div',
		className: 'board',

		MAX_COLS: 3,

		initialize: function() {
			this.board = this.options.board;
			this.board.on('reset', this.render, this);

			this.el.ontouchmove = function(e) { e.preventDefault(); };
		},

		render: function() {
			Parent.prototype.render.call(this);
			this.renderGameTable();
			return this;
		},

		renderChildren: function() {
			var board = this.board;
			return _.map(_.range(board.length), function(i) {
				return new SlotView({slot: board.at(i)}).render();
			});
		},

		renderGameTable: function() {
			this.$el.empty();
			var table = this.make('table'),
				rows = Math.ceil(this.board.length / this.MAX_COLS);
			for (var row = 0; row < rows; row++) {
				var tr = this.make('tr');
				for (var col = 0; col < this.MAX_COLS; col++) {
					var position = (row * this.MAX_COLS) + col,
						child = this.child_views[position];
					if (!child) {
						continue;
					}
					tr.appendChild(child.el);
				}
				table.appendChild(tr);
			}
			this.el.appendChild(table);
		}
	});

})(window.Views.Bases.ParentView, window.Views.Slot);
