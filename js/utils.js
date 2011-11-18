"use strict";
/*
 * http://www.modernizr.com/downloads/modernizr-2.0.4.js
 */
var hasLocalStorage = function() {
	try {
		return !!localStorage.getItem;
	} catch(e) {
		return false;
	}
};
