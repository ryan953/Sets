define([
	'underscore',
	'handlebars',
	'thorax',
	'v!./slot',
	'utils/orientation'
], function(_, Handlebars, Thorax, SlotView, Orientation) {
	"use strict";

	return Thorax.View.extend({
		tagName: 'table',
		className: 'board',

		MAX_PORTRAIT: 3,

		template: function() { return ''; },

		initialize: function() {
			this.listenTo(this.board, 'reset add remove', this.render);

			this.el.ontouchmove = function(e) { e.preventDefault(); };

			this.listenTo(Orientation, 'change', this.renderGameTable);
		},

		render: function() {
			var cols = this.getMaxCols(Orientation.isPortrait()),
				rows = Math.ceil(this.board.length / cols);

			this.template = Handlebars.compile(
				this.constructBoardInnardsTemplate(rows, cols)
			);

			Thorax.View.prototype.render.call(this);
		},

		constructBoardInnardsTemplate: function(rows, cols) {
			var eachRow = _.range(rows),
				eachCol = _.range(cols),
				helpers = _.map(_.range(rows * cols), function(i) {
					return '{{view "game/views/slot" settings=settings board=board position="' + i + '"}}';
				});

			var concatRow = function(rowElems) {
					return rowElems
						.concat('<tr>')
						.concat(_.reduce(eachCol, pushColumn, []))
						.concat('</tr>');
				},
				pushColumn = function(colElems) {
					return (colElems.push(helpers.shift()) && colElems);
				};

			return _.reduce(eachRow, concatRow, []).join('');
		},

		getMaxCols: function(isPortrait) {
			var boardSize = this.board.boardSize(),
				maxLandscape = (boardSize / this.MAX_PORTRAIT) || this.MAX_PORTRAIT;
			return isPortrait ? this.MAX_PORTRAIT :  maxLandscape;
		}
	});

});
