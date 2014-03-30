define([
	'jquery',
	'underscore',
	'view',
	'v!./slot',
	'utils/orientation'
], function($, _, Parent, SlotView, Orientation) {
	"use strict";

	return Parent.extend({
		tagName: 'div',
		className: 'board',

		MAX_PORTRAIT: 3,

		initialize: function(options) {
			this.options = options;
			this.listenTo(options.board, 'reset add remove', this.render);

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
				var slot = new SlotView({
					settings: options.settings,
					model: options.board.at(i)
				});
				slot.render();
				return slot;
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

});
