function Assistant(delay) {
	this.event = new Event();
	this.initWorker();
}
(function() {
	var hasWorkers = function() {
		return !!window.Worker;
	},
	handleMessage = function(event) {
		var data = event.data;
		
		try {
			var rtrn = Assistant[data.cmd](data);
		} catch (err) {
			rtrn = 'Unknown Command ' + data.cmd;
		}
		
		try {
			return self.postMessage( rtrn );
		} catch (err) {
			return rtrn;
		}
	};
	
	if (self) {
		self.addEventListener('message', handleMessage);
	}
	
	Assistant.reflect = function(data) {
		var msg = data.msg;
		return msg;
	};
	
	Assistant.makePick = function(data) {
		var boardList = data.boardList,
			selected = data.selected;
			
		return 'idk' + boardList.length + ' ' + selected.length;
	};
	
	
	
	Assistant.prototype.initWorker = function() {
		if (hasWorkers()) {
			this.worker = new Worker('assistant.js');
			this.worker.addEventListener('message', function(event) {
				console.debug('Message Received', event, event.data);
			});
			this.worker.addEventListener('error', function(event) {
				console.error('Worker Error', event);
			});
		} else {
			//throw new Error('Web Workers Not Supported');
			//console.error('Workers Not Supported: falling back');
		}
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
	
	
	
	Assistant.prototype.sendMessage = function(msg) {
		if (this.worker) {
			console.debug('posting message to worker', msg);
			this.worker.postMessage(msg);
		} else {
			console.debug('handling the message right now', msg);
			var response = handleMessage({data:msg});
			console.debug('response was', response);
		}
	};
	Assistant.prototype.pickNotPossible = function(boardList, selected) {
		this.sendMessage({
			cmd:'makePick',
			boardList:boardList,
			selected:selected
		});
	};
})();

(function() {
	
})();
