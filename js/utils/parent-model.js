define([
	'backbone',
	'backbone-identity-map'
], function(Backbone, mapper) {
	"use strict";

	return window.Model = {
		factory: function(protoProps, staticProps) {
			return mapper(Backbone.Model.extend(protoProps, staticProps));
		},
		getCache: mapper.getCache,
		purgeCache: mapper.purgeCache
	};
	
});
