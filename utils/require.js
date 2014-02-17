(function() {
	"use strict";
	var getMapping = function() {
			window.Fresh = window.Fresh || {};
			window.Fresh.ui = window.Fresh.ui || {};

			return {
				'jquery': window.jQuery,
				'underscore': window._,
				'backbone': window.Backbone,
				'moment': window.moment
			};
		},

		createNamespace = function(name, value) {
			var context = window;
			name = name.split('/');

			for (var i = 0; i < name.length; i++) {
				var part = toPascalCase(name[i]);
				if (context[part] === undefined) {
					if (i == name.length - 1) {
						context[part] = value;
					} else {
						context[part] = {};
					}
				}
				context = context[part];
			}
		},

		getObjectWithName = function(name) {
			var context = window;
			name = name.split('/');

			while(name.length) {
				var objName = toPascalCase(name.shift());
				context = context[objName];
			}
			return context;
		},

		toPascalCase = function(name) {
			return name.replace(/(\w)(\w*)/g, function(g0,g1,g2){
				return g1.toUpperCase() + g2.toLowerCase();
			}).replace(/-/g, '');
		},

		resolveDependencies = function(dependencies) {
			var resolved = [],
				mapping = getMapping();
			for (var i = 0; i < dependencies.length; i++) {
				var path = dependencies[i];
				if (!path) {
					continue;
				}
				if (mapping[path]) {
					resolved.push(mapping[path]);
				} else if (path === 'domReady!') {
					resolved.push(document);
				} else if (path.indexOf('tmpl!') === 0) {
					path = path.replace('tmpl!', '');
					var template = new window.Fresh.Template(path);
					if (!template || template._template.text == path) {
						throw new Error('Precompiled template not found: ' + path);
					}
					resolved.push(template);
				} else {
					var obj = getObjectWithName(path);
					if (!obj) {
						throw new Error('Can not resolve ' + path + ' for importing');
					}
					resolved.push(obj);
				}
			}
			return resolved;
		},

		domReadyWrapper = function(deps, callback) {
			if ($.inArray('domReady!', deps ) > -1) {
				$(document).ready(function() {
					callback();
				});
			} else {
				callback();
			}
		};

	window.require = function(deps, module) {
		domReadyWrapper(deps, function() {
			module.apply({}, resolveDependencies(deps));
		});
	};

	window.define = function(name, deps, module) {
		if (typeof(module) == 'function') {
			domReadyWrapper(deps, function() {
				createNamespace(name, module.apply({}, resolveDependencies(deps)));
			});
		} else {
			domReadyWrapper(deps, function() {
				createNamespace(name, module);
			});
		}
	};

})();
