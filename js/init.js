"use strict";
$(document).ready(function() {	
	var bindGameToUI = function(game, ui) {
		game
			.bind('end', function() {
				window.location = '#game-over';
			})
			.bind('start', function() {
				ui.renderGame(this);
			})
			.bind('select-card', function() { ui.updateSelected(this.board); })
			.bind('deselect-card', function() { ui.updateSelected(this.board); })
			.bind('selection-cleared', function(e, cards) { ui.showWrongSelection(this, cards); })
			.bind('found-set', function(e, cards) {
				ui.showFoundSet(this, cards);
			})
			.bind('score.change', function(e, data) {
				// console.log('score.change', data);
				$('#score').html(data.found + '/' + data.deck);

				var percent = (data.deck != 0 ?  Math.round(data.found / data.deck * 1000)/10 : 0);
				$('#percent').html(percent + '%');
			});
	};

	var bindGameToDOM = function(game, ui) {
		$('.game-reset').click(function() {
			//ui.renderGame(
				game.start( Settings.selectedMode() )
			//);
		});

		$(ui.container).delegate('td', 'click', function() {
			var self = $(this),
				row = self.parent().index(),
				col = self.index();
			game.selectCard(game.getCard(row, col));
		});
	};

	var buildAssistant = function(game, ui) {
		// Assistant setup -> happens before game.start()
		var assistant = new Assistant(/* delay = */ 5500),
			clearAndRestartSearch = function(e) {
				if (Settings.helpMode()) {
					assistant.stopClock();
					assistant.startSearchForUnmatched(game.listCardsOnBoard());

					game.listCardsOnBoard().forEach(function(card) {
						if (assistant.unmatchedCards().indexOf(card) === -1) {
							card.notPossible = false;
						}
					});
					ui.updateSelected(game.board);
				}
			};

		assistant
			.bind('timer.start', function() {
				ui.container.className = 'helping';
			})
			.bind('timer.stop', function() {
				ui.container.className = '';
			})
			.bind('picked-not-possible', function(event, card) {
				game.getCard(card.row, card.col).notPossible = true;
				ui.updateSelected(game.board);
			});
		['start',
			'end',
			'select-card',
			'deselect-card',
			'selection-cleared',
			'found-set'].forEach(function(event) {
			game.bind(event, clearAndRestartSearch);
		});

		return assistant;
	};

	var game = new Sets(), //game start is at the bottom, after we attach some events!
		ui = new SetsUI(document.getElementById('game-area')),
		assistant = buildAssistant(game, ui);

	bindGameToUI(game, ui);
	bindGameToDOM(game, ui);

	//after init
	game.start( Settings.selectedMode() );
});
