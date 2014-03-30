define([
	'jquery',
	'underscore',
	'thorax',
	'v!./slot',
	'utils/orientation'
], function($, _, Thorax, SlotView, Orientation) {
	"use strict";

	return Thorax.View.extend({
		tagName: 'div',
		className: 'board',

		MAX_PORTRAIT: 3,

		template: function() { return ''; },

		initialize: function() {
			this.listenTo(this.board, 'reset add remove', this.render);

			this.el.ontouchmove = function(e) { e.preventDefault(); };

			this.listenTo(Orientation, 'change', this.renderGameTable);
		},

		render: function() {
			Thorax.View.prototype.render.call(this);
			this.child_views = this.renderChildren();
			this.renderGameTable();
		},

		renderChildren: function() {
			var board = this.board,
				settings = this.settings;
			return _.map(_.range(board.length), function(i) {
				var slot = new SlotView({
					settings: settings,
					model: board.at(i)
				});
				slot.render();
				return slot;
			});
		},

		renderGameTable: function() {
			var maxCols = this.getMaxCols(Orientation.isPortrait()),
				table = $('<table></table>'),
				rows = Math.ceil(this.board.length / maxCols);
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
			var boardSize = this.board.boardSize(),
				maxLandscape = (boardSize / this.MAX_PORTRAIT) || this.MAX_PORTRAIT;
			return isPortrait ? this.MAX_PORTRAIT :  maxLandscape;
		}
	});

});
