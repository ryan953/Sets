/**
 * Binds a function to the given object's scope
 *
 * @param {Object} object The object to bind the function to.
 * @return {Function}	Returns the function bound to the object's scope.
 */
Function.prototype.bind = function (object) {
	var method = this;
	return function () {
		return method.apply(object, arguments);
	};
};

/**
 * Create a new instance of Event.
 *
 * @classDescription	This class creates a new Event.
 * @return {Object}	Returns a new Event object.
 * @constructor
 */
function Event() {
	this.events = [];
	this.builtinEvts = [];
}

/**
 * Gets the index of the given action for the element
 *
 * @memberOf Event
 * @param {Object} obj The element attached to the action.
 * @param {String} evt The name of the event.
 * @param {Function} action The action to execute upon the event firing.
 * @param {Object} binding The object to scope the action to.
 * @return {Number} Returns an integer.
 */
Event.prototype.getActionIdx = function (obj, evt, action, binding) {
	if (obj && evt) {
		var curel = this.events[obj][evt];
		if (curel) {
			var len = curel.length;
			for (var i = len - 1; i >= 0; i--) {
				if (curel[i].action == action && curel[i].binding == binding) {
					return i;
				}
			}
		} else {
			return -1;
		}
	}
	return -1;
};

/**
 * Adds a listener
 *
 * @memberOf Event
 * @param {Object} obj The element attached to the action.
 * @param {String} evt The name of the event.
 * @param {Function} action The action to execute upon the event firing.
 * @param {Object} binding The object to scope the action to.
 * @return {null} Returns null.
 */
Event.prototype.addListener = function (obj, evt, action, binding) {
	if (this.events[obj]) {
		if (this.events[obj][evt]) {
			if (this.getActionIdx(obj, evt, action, binding) == -1) {
				var curevt = this.events[obj][evt];
				curevt[curevt.length] = {
					action: action,
					binding: binding
				};
			}
		} else {
			this.events[obj][evt] = [];
			this.events[obj][evt][0] = {
				action: action,
				binding: binding
			};
		}
	} else {
		this.events[obj] = [];
		this.events[obj][evt] = [];
		this.events[obj][evt][0] = {
			action: action,
			binding: binding
		};
	}
};

/**
 * Removes a listener
 *
 * @memberOf Event
 * @param {Object} obj The element attached to the action.
 * @param {String} evt The name of the event.
 * @param {Function} action The action to execute upon the event firing.
 * @param {Object} binding The object to scope the action to.
 * @return {null} Returns null.
 */
Event.prototype.removeListener = function (obj, evt, action, binding) {
	if (this.events[obj]) {
		if (this.events[obj][evt]) {
			var idx = this.getActionIdx(obj, evt, action, binding);
			if (idx >= 0) {
				this.events[obj][evt].splice(idx, 1);
			}
		}
	}
};

/**
 * Fires an event
 *
 * @memberOf Event
 * @param e [(event)] A builtin event passthrough
 * @param {Object} obj The element attached to the action.
 * @param {String} evt The name of the event.
 * @param {Object} args The argument attached to the event.
 * @return {null} Returns null.
 */
Event.prototype.fireEvent = function(e, obj, evt, args) {
	if (!e) { e = window.event; }
	if (evt != '*') {
		e.name = evt;
		this.fireEvent(e, obj, '*', args);
	}
	if (obj && this.events) {
		var evtel = this.events[obj];
		if (evtel) {
			var curel = evtel[evt];
			if (curel) {
				for (var act in curel) {
					var action = curel[act].action;
					if (curel[act].binding) {
						action = action.bind(curel[act].binding);
					}
					action.call(obj, e, args);
				}
			}
		}
	}
};
