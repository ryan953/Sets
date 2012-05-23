(function() {
	if (!Array.shuffle) {
		Array.shuffle = function() {
			var array = this;
			if (!array) { return array; }
			var tmp, current, top = array.length;

			if(top) while(--top) {
				current = Math.floor(Math.random() * (top + 1));
				tmp = array[current];
				array[current] = array[top];
				array[top] = tmp;
			}

			return array;
		};
	}
})();