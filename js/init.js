/*global $:false Assistant:false Sets:false Settings:false GameTimer:false */

$(document).ready(function() {
	"use strict";
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
				$('#score').html(data.found + '/' + data.deck);
				$('#remaining').html(data.deck - data.found);

				var percent = (data.deck !== 0 ? Math.round(data.found / data.deck * 1000)/10 : 0);
				$('#percent').html(percent + '%');
			})
			;
	};

	var bindGameToDOM = function(game, ui) {
		$('.game-reset').click(function() {
			game.start( Settings.selectedMode() );
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
		var assistant = new window.Sets.Assistant(/* delay = */ 5500),
			clearAndRestartSearch = function(e) {
				if (Settings.helpMode()) {
					assistant.stopClock();
					assistant.startSearchForUnmatched(game.listCardsOnBoard());

					game.listCardsOnBoard().forEach(function(card) {
						if (assistant.not_possible_cards.indexOf(card) === -1) {
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
			})
			.bind('no-cards-possible', function() {
				// console.log('no-cards-possible');
				game.addCards();
				game.tryEnd();
			});
		['start',
			'end',
			'select-card',
			'deselect-card',
			'selection-cleared',
			'found-set'].forEach(function(event) {
			game.bind(event, clearAndRestartSearch);
		});
		Settings.bind('change:help-mode', function(e, enabled) {
			if (enabled) {
				clearAndRestartSearch();
			} else {
				assistant.stopClock();
			}
		});

		return assistant;
	};

	var game = new window.Sets.Game(), //game start is at the bottom, after we attach some events!
		ui = new window.Sets.SetsUI(document.getElementById('game-area')),
		assistant = buildAssistant(game, ui);

	bindGameToUI(game, ui);
	bindGameToDOM(game, ui);

	GameTimer.init(game);

	//after init
	setTimeout(function() {
		game.start( Settings.selectedMode() );
	}, 0);
});
