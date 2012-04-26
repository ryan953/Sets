
window.Sets = window.Sets || {};

window.Sets.AppCache = (function(w) {
	var _this = this;

	_this.updateReady = false;
	
	w.addEventListener('load', function(e) {
		w.applicationCache.addEventListener('updateready', function(e) {
			if (w.applicationCache.status == w.applicationCache.UPDATEREADY) {
				_this.updateReady = true;
			}
		}, false);
	}, false);

	var AppCache = {
		updateReady: function() {
			return this.updateReady;
		},
		swapCache: function() {
			w.applicationCache.swapCache();
		},
		reload: function() {
			w.location.reload();
		}
	};

	Event.patch.call(AppCache);

	return AppCache;
})(window);
