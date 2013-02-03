/*global document */
window.Views = window.Views || {};

window.Views.Board = (function(Parent, SlotView) {
	"use strict";

	return Parent.extend({
		tagName: 'div',
		className: 'board',

		MAX_COLS: 3,

		initialize: function() {
			this.options.board.on('reset add remove', this.render, this);

			this.el.ontouchmove = function(e) { e.preventDefault(); };
		},

		render: function() {
			Parent.prototype.render.call(this);
			this.renderGameTable();
			return this;
		},

		renderChildren: function() {
			var options = this.options;
			return _.map(_.range(options.board.length), function(i) {
				return new SlotView({
					settings: options.settings,
					slot: options.board.at(i)
				}).render();
			});
		},

		renderGameTable: function() {
			var table = $('<table></table>'),
				rows = Math.ceil(this.options.board.length / this.MAX_COLS);
			for (var row = 0; row < rows; row++) {
				var tr = $('<tr></tr>');
				for (var col = 0; col < this.MAX_COLS; col++) {
					var position = (row * this.MAX_COLS) + col,
						child = this.child_views[position];
					if (!child) {
						continue;
					}
					tr.append(child.el);
				}
				table.append(tr);
			}
			this.$el.html(table);
		}
	});

})(window.Views.Bases.ParentView, window.Views.Slot);
