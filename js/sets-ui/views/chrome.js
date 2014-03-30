define([
	'thorax',
	'v!./menubar'
], function(Thorax, Menubar) {
	"use strict";

	return Thorax.LayoutView.extend({
		tagName: 'div',
		className: 'views-chrome',

		initialize: function() {
			this.on('ready', function() {
				this.setView(new Menubar({
					game: this.game
				}));
			});
		}
	});

});
