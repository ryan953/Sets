"use strict";

function WorkerProxy() {
	this.worker = null;
	this.event = new Event();
}
(function() {
	var hasWorkers = function() {
		return !!window.Worker;
	};

	WorkerProxy.prototype.initWorker = function(scriptPath) {
		if (hasWorkers()) {
			var self = this;
			scriptPath = [scriptPath, Math.floor(Math.random()*100)].join('?');
			this.worker = new Worker(scriptPath);
			this.worker.addEventListener('message', function(event) {
				WorkerProxy.handleWorkerMessage(self, event);
				//self.handleWorkerMessage(event);
			});
			this.worker.addEventListener('error', function(event) {
				console.error('Worker Error', event);
			});
		} else {
			throw new Error('Web Workers Not Supported');
		}
	};
	
	WorkerProxy.prototype.handleWorkerMessage = function(event) {
		var data = event.data;
		if (data.event) {
			return this.trigger(data.event, data.data);
		} else if (data.cmd) {
			return this[data.cmd](data.data);
		} else {
			console.debug('Worker said:', data);
		}
	};
	
	WorkerProxy.prototype.bind = function(name, handler) {
		this.event.addListener(this, name, handler);
		return this;
	};
	WorkerProxy.prototype.trigger = function(name, data) {
		this.event.fireEvent({}, this, name, data);
		return this;
	};
	WorkerProxy.prototype.unbind = function(name, handler) {
		this.event.removeListener(this, name, handler);
		return this;
	};
})();

function Assistant(delay) {
	this.delay = delay;
	this.timer = null;
	this.cards_to_disable = null;
}
(function() {
	Assistant.prototype = new WorkerProxy();
	
	Assistant.prototype.init = function() {
		WorkerProxy.initWorker.call(this, './js/assistant_worker.js');
	};
	
	/**
	 * get the worker crunching the numbers
	 */
	Assistant.prototype.findNotPossibleCard = function(board) {
		var self = this;
		
		//self.cacheCardsToDisable(null);
		self.worker.postMessage({
			cmd: 'listNotPossibleCards',
			rtrncmd: 'cacheCardsToDisable',
			board: board
		});
		
		this.startClock(function() {
			return self.revealNotPossibleCard();
		});
	};
	
	/**
	 * listen for the list of not possible cards and hang on to them
	 */
	Assistant.prototype.cacheCardsToDisable = function(cards) {
		console.debug('caching cards to disable', cards);
		this.cards_to_disable = cards;
	};
	
	/**
	 * show a not possible card on the clock-tick
	 */
	Assistant.prototype.revealNotPossibleCard = function() {
		console.debug('clock tick', JSON.stringify(this.cards_to_disable));
		if (!(this.cards_to_disable instanceof Array)) {
			return true;
		}
		if (this.cards_to_disable.length) {
			this.trigger('picked-not-possible', this.cards_to_disable.shift());
		}
		return this.cards_to_disable.length;
	};
	
	/**
	 * takes a delay between clock ticks, and an action to do each tick
	 * when the action returns false the clock will turn itself off
	 */
	Assistant.prototype.startClock = function(tickAction) {
		this.stopClock();
		var self = this,
			clockTick = function() {
			if (tickAction()) {
				self.timer = setTimeout(clockTick, self.delay);
			}
		};
		clockTick();
	};
	
	/**
	 * Stop the timer so we don't return any cards
	 */
	Assistant.prototype.stopClock = function() {
		if (this.timer) {
			clearTimeout(this.timer);
			this.timer = null;
		}
	};
})();
