/*global $ */

(function(){
	"use strict";

	window.Storage = {
		factory: function() {
			if (!this._singleton) {
				this._singleton = supports_html5_storage() ? new LocalStore() : new JSStore();
			}
			return this._singleton;
		}
	};

	function supports_html5_storage() {
		try {
			return 'localStorage' in window && window.localStorage !== null;
		} catch (e) {
			return false;
		}
	}
	function Store() {
		this.appendTo = function(key, val) {
			var arr = (this.get(key) || []);
			arr.push(val);
			this.put(key, arr);
		};
		this.fire = function(key, action, oldVal, newVal) {
			// console.debug("Trigger:", key + '.' + action, {
			//	oldVal:oldVal,
			//	newVal:newVal
			// });
			$(this).trigger(key + '.' + action, {
				oldVal:oldVal,
				newVal:newVal
			});
		};
	}

	var LocalStore = function() {};
	LocalStore.prototype = new Store();
	LocalStore.prototype.get = function(key) {
		if (localStorage.getItem(key) != 'undefined') {
			return JSON.parse(localStorage.getItem(key));
		} else {
			return null;
		}
	};
	LocalStore.prototype.put = function(key, val) {
		var oldVal = this.get(key);
		localStorage.setItem(key, JSON.stringify(val));
		this.fire(key, (oldVal ? 'change' : 'add'), oldVal, val);
	};
	LocalStore.prototype.remove = function(key) {
		var oldVal = this.get(key);
		localStorage.removeItem(key);
		this.fire(key, 'remove', oldVal, null);
	};
	LocalStore.prototype.clear = function() {
		localStorage.clear();
		this.fire('*', 'clear', null, null);
	};

	var JSStore = function() {};
	JSStore.prototype = new Store();
	JSStore.prototype.data = {};
	JSStore.prototype.get = function(key) {
		return this.data[key] || null;
	};
	JSStore.prototype.put = function(key, val) {
		var oldVal = this.get(key);
		this.data[key] = val;
		this.fire(key, (oldVal ? 'change' : 'add'), oldVal, val);
	};
	JSStore.prototype.remove = function(key) {
		var oldVal = this.get(key);
		delete(this.data[key]);
		this.fire(key, 'remove', oldVal, null);
	};
	JSStore.prototype.clear = function() {
		this.data = {};
		this.fire('*', 'clear', null, null);
	};
})();
