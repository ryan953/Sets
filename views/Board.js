/*global document */
window.Views = window.Views || {};

window.Views.Board = (function(Parent, SlotView) {
	"use strict";

	return Parent.extend({
		tagName: 'div',
		className: 'board',

		MAX_PORTRAIT: 3,

		initialize: function() {
			this.listenTo(this.options.board, 'reset add remove', this.render);

			this.el.ontouchmove = function(e) { e.preventDefault(); };

			this.listenTo(Orientation, 'change', this.renderGameTable);
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
			var maxCols = this.getMaxCols(Orientation.isPortrait()),
				table = $('<table></table>'),
				rows = Math.ceil(this.options.board.length / maxCols);
			for (var row = 0; row < rows; row++) {
				var tr = $('<tr></tr>');
				for (var col = 0; col < maxCols; col++) {
					var position = (row * maxCols) + col,
						child = this.child_views[position];
					if (!child) {
						continue;
					}
					tr.append(child.el);
				}
				table.append(tr);
			}
			this.$el.html(table);
		},

		getMaxCols: function(isPortrait) {
			var boardSize = this.options.board.boardSize(),
				maxLandscape = (boardSize / this.MAX_PORTRAIT) || this.MAX_PORTRAIT;
			return isPortrait ? this.MAX_PORTRAIT :  maxLandscape;
		}
	});

})(window.Views.Bases.ParentView, window.Views.Slot);
