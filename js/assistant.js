function Assistant(delay) {
	this.delay = delay * 1000;
	this.event = new Event();
	this.init();
	this.timer = null;
}
(function() {
	var hasWorkers = function() {
		return !!window.Worker;
	};
	
	var handleWorkerMessage = function(event) {
		var data = event.data;
		switch(data.cmd) {
		case 'pickedNotPossible':
			return self.trigger('picked-not-possible', data);
		case 'all-are-possible':
			return null;
			
		default:
			console.debug('Worker said:', data);
		}
		if (data && data.cmd) {
			self[data.cmd](data);
		}
	};
	
	Assistant.prototype.init = function() {
		if (hasWorkers()) {
			var self = this;
			this.worker = new Worker('./js/assistant_worker.js');
			this.worker.addEventListener('message', handleWorkerMessage);
			this.worker.addEventListener('error', function(event) {
				console.error('Worker Error', event);
			});
		} else {
			throw new Error('Web Workers Not Supported');
		}
	};
	
	/**
	 * get the working crunching the numbers
	 */
	Assistant.prototype.findNotPossibleCard = function(list, selected) {
		this.worker.postMessage({
			cmd: 'startLooking',
			boardList: self.boardList,
			cardsSelected: self.cardsSelected
		});
	};
	
	/**
	 * stop the worker from crunching the numbers, if it's still going
	 */
	Assistant.prototype.stopTimer = function() {
		this.worker.postMessage({
			cmd:'stopLooking'
		});
	};
	
	
	
	Assistant.prototype.bind = function(name, handler) {
		this.event.addListener(this, name, handler);
		return this;
	};
	Assistant.prototype.trigger = function(name, data) {
		this.event.fireEvent({}, this, name, data);
		return this;
	};
	Assistant.prototype.unbind = function(name, handler) {
		this.event.removeListener(this, name, handler);
		return this;
	};
})();
