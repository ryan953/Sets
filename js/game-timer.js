/*global $ jintervals */

window.GameTimer = (function() {
	"use strict";
	return {
		init: function(game) {
			var _this = this;
			var tick = function() {
				var diff = parseInt((new Date().getTime() - _this.start) / 1000, 10);
				$('#time').text(jintervals(diff, "{MM}:{ss}"));
				_this.timeout = setTimeout(tick, 1000);
			};

			this.timeout = null;

			game.bind('start', function() {
				_this.start = new Date().getTime();
				_this.timeout = setTimeout(tick, 1000);
			});
			game.bind('end', function() {
				clearTimeout(_this.timeout);
				_this.timeout = null;
				_this.start = null;
				$('#time').text('');
			});
		}
	};
})();
