

(function($){
	$.fn.autoRotate = function( options ) {
		var ctx = {},
		defaults = {
			autoStart: true,
			time: 0,
			activateItem: function() { /*console.debug('activate', this);*/ $(this).show(); },
			deactivateItem: function() { /*console.debug('deactivate', this);*/ $(this).hide(); }
		},
		methods = {
			onTimeout: function() {
				var toShow;
				this.elements.each(function() {
					toShow = (this.currentItem.next().length ? this.currentItem.next() : $(this).children().first());
					methods.showItem.apply( this, [toShow] );
					this.currentItem = toShow;
				});
				methods.start();
			},
			start: function() {
				ctx.timer = setTimeout(function() { methods.onTimeout.apply(ctx); }, ctx.options.time);
			},
			stop: function() {
				clearTimeout(ctx.timer);
			},
			showItem: function(next) {
				ctx.options.deactivateItem.call(this.currentItem);
				this.currentItem = $(next);
				ctx.options.activateItem.call(this.currentItem);
			}
		};

		ctx.elements = $(this);
		ctx.options = {};
		$.extend(ctx.options, defaults);
		$.extend(ctx.options, options);

		ctx.elements.each(function() {
			this.currentItem = $(this).children().first();
			$(this).children().not(this.currentItem).each(ctx.options.deactivateItem);
			ctx.options.activateItem.apply(this.currentItem);
		});

		if (ctx.options.autoStart) { methods.start(); }

		this.autoRotate = {
			start: methods.start,
			stop: methods.stop,
			showItem: methods.showItem
		}

		return this;
	};
})(jQuery);

