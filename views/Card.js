/*global Backbone document */

window.Views = window.Views || {};
window.Views.Card = (function() {

	var visuals = function(card) {
		var fills = {
			solid: {
				lineWidth:0,
				fillStyle:card.color
			},
			empty: {
				lineWidth:4,
				fillStyle:'transparent'
			},
			striped: {
				lineWidth:1,
				fillStyle:Card.stripedFills[card.color]
			}
		};
		return fills[card.fill];
	};

	return Backbone.View.extend({
		tagName: 'div',
		className: '',

		events: {
			click: 'handleClick'
		},

		render: function() {
			var canvas = this.make("canvas", {width: 150, height: 150});
			this.draw(canvas.getContext('2d'));
			this.$el.append(
				canvas
			);
		},

		draw: function(ctx) {
			ctx.clearRect(0, 0, 150, 150);
			for(var i = 0; i < this.model.get('count'); i++) {
				ctx.save();
				ctx.translate(25, ([50, 25, 0])[this.model.get('count')-1] + (i*50));
				Card.paths[this.model.get('shape')](ctx);
				var visualSettings = visuals(this.model);
				ctx.lineWidth = visualSettings.lineWidth;
				ctx.fillStyle = visualSettings.fillStyle;
				ctx.strokeStyle = this.model.get('color');
				ctx.stroke();
				ctx.fill();
				ctx.restore();
			}
		},

		handleClick: function() {

		}
	});
})();