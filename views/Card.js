/*global Backbone, document */
window.Views = window.Views || {};

window.Views.Card = (function(Parent) {
	"use strict";

	var patterns = {
		vertical: function(ctx, lineWidth) {
			ctx.moveTo(lineWidth/2, 0);
			ctx.lineTo(lineWidth/2, lineWidth*2);
		},
		diagonal: function(ctx, lineWidth) {
			ctx.moveTo(0, 0);
			ctx.lineTo(lineWidth*2, lineWidth*2);
			ctx.moveTo(0, lineWidth*2-1);
			ctx.lineTo(0, lineWidth*2+1);
			ctx.moveTo(lineWidth*2-1, 0);
			ctx.lineTo(lineWidth*2+1, 0);
			ctx.stroke();
		}
	};

	var getPattern = function(color, lineWidth, strategy) {
		var stripes = document.createElement('canvas'),
			ctx;

		strategy = strategy || patterns.diagonal;

		stripes.width = lineWidth * 2;
		stripes.height = lineWidth * 2;
		ctx = stripes.getContext('2d');
		ctx.save();
		ctx.strokeStyle = color;
		ctx.lineWidth = lineWidth/2;

		strategy(ctx, lineWidth);

		ctx.restore();
		return ctx.createPattern(stripes, 'repeat');
	};

	var colorTranslation = {
		red: '#bf4040',
		green: '#40bf40',
		blue: '#4040bf'
	};

	var stripedFills = {
		red: getPattern(colorTranslation.red, 4),
		green: getPattern(colorTranslation.green, 4),
		blue: getPattern(colorTranslation.blue, 4)
	};

	var visuals = function(color, fill) {
		var fills = {
			solid: {
				lineWidth: 0,
				fillStyle: colorTranslation[color],
				color: colorTranslation[color]
			},
			empty: {
				lineWidth: 4,
				fillStyle: 'transparent',
				color: colorTranslation[color]
			},
			striped: {
				lineWidth: 1,
				fillStyle: stripedFills[color],
				color: colorTranslation[color]
			}
		};
		return fills[fill];
	};

	var paths = {
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

	return Parent.extend({
		tagName: 'div',
		className: 'card',

		initialize: function() {
			this.card = this.options.card;
		},

		render: function() {
			var canvas = $('<canvas>')
				.attr({width: 150, height: 150});
			this._draw(canvas[0].getContext('2d'));
			this.$el.html(canvas);

			return this;
		},

		_draw: function(ctx) {
			ctx.clearRect(0, 0, 150, 150);
			for(var i = 0; i < this.card.get('num'); i++) {
				ctx.save();
				ctx.translate(25, ([50, 25, 0])[this.card.get('num')-1] + (i*50));
				paths[this.card.get('shape')](ctx);
				var visualSettings = visuals(this.card.get('color'), this.card.get('fill'));
				ctx.lineWidth = visualSettings.lineWidth;
				ctx.fillStyle = visualSettings.fillStyle;
				ctx.strokeStyle = visualSettings.color;
				ctx.stroke();
				ctx.fill();
				ctx.restore();
			}
		}
	});
})(Backbone.View);
