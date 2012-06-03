/*global Backbone document */

window.Models = window.Models || {};
 (function(Models) {
	"use strict";

	var Card = Models.Card = Backbone.Model.extend({
		defaults: {
			'num': 0,
			'shape': Card.shapes[0],
			'color': Card.colors[0],
			'fill': Card.fills[0],

			// card states
			'is_selected': false,
			'possible': null,
			'invalid': null
		}
	});

	function getPattern(color, lineWidth) {
		var stripes = document.createElement('canvas'),
			ctx;

		stripes.width = lineWidth * 2;
		stripes.height = lineWidth * 2;
		ctx = stripes.getContext('2d');
		ctx.save();
		ctx.strokeStyle = color;
		ctx.lineWidth = lineWidth/2;

		/** vertical lines */
		/*ctx.moveTo(lineWidth/2, 0);
		ctx.lineTo(lineWidth/2, lineWidth*2);*/

		/** diagonal **/
		ctx.moveTo(0, 0);
		ctx.lineTo(lineWidth*2, lineWidth*2);
		ctx.moveTo(0, lineWidth*2-1);
		ctx.lineTo(0, lineWidth*2+1);
		ctx.moveTo(lineWidth*2-1, 0);
		ctx.lineTo(lineWidth*2+1, 0);
		ctx.stroke();

		ctx.restore();
		return ctx.createPattern(stripes, 'repeat');
	}

	Card.counts = [1, 2, 3];
	Card.shapes = ['Triangle', 'Circle', 'Square' /*, 'Diamond', 'Squiggle', 'Oval'*/];
	Card.fills = ['solid', 'empty', 'striped'];
	Card.colors = ['red', 'green', 'blue'];
	Card.stripedFills = {
		red:getPattern('red', 4),
		green:getPattern('green', 4),
		blue:getPattern('blue', 4)
	};
	Card.paths = {
		Diamond: function(ctx) {
			ctx.beginPath();
			ctx.moveTo(50, 2); ctx.lineTo(0, 25); ctx.lineTo(50, 48); ctx.lineTo(100, 25);
			ctx.closePath();
		},
		Oval: function(ctx) {
			ctx.beginPath();
			ctx.arc(75, 25, 22, -Math.PI/2, Math.PI/2, false); ctx.arc(25, 25, 22, Math.PI/2, -Math.PI/2, false);
			ctx.closePath();
		},
		Squiggle: function(ctx) {
			ctx.beginPath();
			ctx.moveTo(70, 10); ctx.bezierCurveTo(0, -20, -20, 75, 30, 40); ctx.bezierCurveTo(100, 70, 120, -25, 70, 10);
			ctx.closePath();
		},
		Square: function(ctx) {
			ctx.beginPath();
			ctx.moveTo(2, 5); ctx.lineTo(98, 5); ctx.lineTo(98, 45); ctx.lineTo(2, 45);
			ctx.closePath();
		},
		Circle: function(ctx) {
			ctx.beginPath();
			ctx.arc(52, 25, 20, 0, Math.PI*2, false);
			ctx.closePath();
		},
		Triangle: function(ctx) {
			ctx.beginPath();
			ctx.moveTo(50, 5); ctx.lineTo(10, 45); ctx.lineTo(90, 45);
			ctx.closePath();
		}
	};
})(window.Models);