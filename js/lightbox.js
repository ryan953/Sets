$(document).ready(function() {
	// Lightbox stuff -> jquery plugin?
	$('<a>')
		.addClass('right button lightbox-close')
		.text('Close')
		.prop('href', '#')
		.wrapInner('<span>')
		.appendTo( $('.lightbox') );
	$('.lightbox').wrapInner('<div>');
});