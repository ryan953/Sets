<!DOCTYPE html>
<html>
<head>
<title>Test: collections/Matcher.js</title>

<link href="../../lib/qunit.css" rel="stylesheet" type="text/css" media="screen" />
<script src="../../lib/qunit.js"></script>
<script src="../../lib/jquery.min.js"></script>
<script src="../../lib/underscore.min.js"></script>
<script src="../../lib/backbone.min.js"></script>

<script src="../../models/Card.js"></script>
<script src="../../models/Slot.js"></script>
<script src="../../collections/Board.js"></script>

<script src="../../models/Matcher.js"></script>

<script>
"use strict";

$(document).ready(function () {
	module('Board.resetNotPossibleSlots');
	function loadBoard(cardData) {
		var mockSettings = {
			get: $.noop
		};

		var slots = [];
		_.times(cardData.length, function(index) {
			slots.push( new Models.Slot({
				is_selected: cardData[index].isSelected
			}, {settings: mockSettings}) );
			delete cardData.isSelected;
		});

		var deck = {
			_cardsData: _.clone(cardData),
			on: _.identity,
			set: _.identity,
			trigger: _.identity,
			hasCards: function() {
				return this._cardsData.length;
			},
			drawCard: function() {
				return new Models.Card(this._cardsData.shift());
			}
		};

		var board = new Collections.Board(slots, {
			deck: deck,
			settings: {
				get: function() {
					return 'on';
				}
			}
		});

		board.drawCards();
		return board;
	}

	function getUnmatched(board) {
		var matcher = new Matcher(null, {
			settings: {
				get: function() { return 'on'; }
			}
		});
		matcher.resetNotPossibleSlots(board);
		var unmatchedSlots = board.where({is_possible: false});
		return board.getCardJson(unmatchedSlots);
	}

	function getSimpleBoard() {
		return [
			{num:1, shape:"Oval", fill:"striped", color:"green"},
			{num:1, shape:"Oval", fill:"striped", color:"red"},
			{num:1, shape:"Oval", fill:"striped", color:"blue"}
		];
	}

	function cardListComparator(left, right) {
		if (left.color != right.color) {
			return (left.color > right.color ? -1 : 1);
		}
		if (left.shape != right.shape) {
			return (left.shape > right.shape ? -1 : 1);
		}
		if (left.num != right.num) {
			return (left.num > right.num ? -1 : 1);
		}
		if (left.fill != right.fill) {
			return (left.fill > right.fill ? -1 : 1);
		}
		return 0;
	};

	function assertCardList(actual, expected, message) {
		actual = actual.sort(cardListComparator);
		expected = expected.sort(cardListComparator);
		deepEqual(actual, expected, message);
	}

	test('less than three cards, must not be a match', function() {
		var cardData = getSimpleBoard();
		cardData.pop();

		var unmatched = getUnmatched(loadBoard(cardData));

		equal(unmatched.length, 2, 'not enough cards to make a match');
		assertCardList(unmatched, [cardData[0], cardData[1]], 'not enough cards to make a match');
	});

	test('all have matches', function() {
		var cardData = getSimpleBoard();

		var unmatched = getUnmatched(loadBoard(cardData));

		equal(unmatched.length, 0, 'all cards should have a match');
		assertCardList(unmatched, [], 'all cards should have a match');
	});

	test('only the last should be unmatched', function() {
		var cardData = getSimpleBoard();
		cardData.push({num:2, shape:"Oval" ,fill:"striped", color:"green"});

		var unmatched = getUnmatched(loadBoard(cardData));

		equal(unmatched.length, 1, 'only one is not a match');
		assertCardList(unmatched, [cardData[3]], 'the last card has no match');
	});

	test('Finds unmatched: no selection', function() {
		var tests = listNotPossibleCardsDataProvider();

		_.each(tests, function(testcase, i) {
			var unmatched = getUnmatched(loadBoard(testcase.board));

			equal(unmatched.length, testcase.notPossible.length, 'failed on index ' + i);
			assertCardList(unmatched, testcase.notPossible, 'failed on index ' + i);
		});
	});

	test('Finds unmatched: one card selected', function() {
		var tests = listNotPossibleCardsOneSelectedDataProvider();

		_.each(tests, function(testcase, i) {
			var unmatched = getUnmatched(loadBoard(testcase.board));

			// equal(unmatched.length, testcase.notPossible.length, 'failed on index ' + i);
			assertCardList(unmatched, testcase.notPossible, 'failed on index ' + i);
		});
	});

	test('Finds unmatched: two cards selected', function() {
		var tests = listNotPossibleCardsTwoSelectedDataProvider();

		_.each(tests, function(testcase, i) {
			var unmatched = getUnmatched(loadBoard(testcase.board));

			equal(unmatched.length, testcase.notPossible.length, 'failed on index ' + i);
			assertCardList(unmatched, testcase.notPossible, 'failed on index ' + i);
		});
	});

	function listNotPossibleCardsDataProvider() {
		return [
			{board: [
				{num:3,shape:"Oval",    fill:"solid",color:"green"},
				{num:2,shape:"Diamond", fill:"solid",color:"green"},
				{num:2,shape:"Squiggle",fill:"solid",color:"red"  },
				{num:3,shape:"Diamond", fill:"solid",color:"green"},
				{num:1,shape:"Oval",    fill:"solid",color:"green"},
				{num:2,shape:"Diamond", fill:"solid",color:"blue" },
				{num:1,shape:"Diamond", fill:"solid",color:"blue" },
				{num:2,shape:"Oval",    fill:"solid",color:"blue" },
				{num:3,shape:"Oval",    fill:"solid",color:"red"  }
			], notPossible: [
				{num:3,shape:"Diamond", fill:"solid",color:"green"},
				{num:2,shape:"Diamond", fill:"solid",color:"blue" }
			]}, {board:  [
				{num:1,shape:"Diamond", fill:"solid",color:"blue" },
				{num:2,shape:"Oval",    fill:"solid",color:"red"  },
				{num:2,shape:"Oval",    fill:"solid",color:"blue" },
				{num:2,shape:"Squiggle",fill:"solid",color:"red"  },
				{num:2,shape:"Squiggle",fill:"solid",color:"blue" },
				{num:3,shape:"Oval",    fill:"solid",color:"blue" },
				{num:1,shape:"Oval",    fill:"solid",color:"green"},
				{num:3,shape:"Squiggle",fill:"solid",color:"green"},
				{num:3,shape:"Diamond", fill:"solid",color:"red"  }
			], notPossible: [
				{num:2,shape:"Oval",    fill:"solid",color:"blue" },
				{num:2,shape:"Squiggle",fill:"solid",color:"red"  }
			]}, {board:  [
				{num:3,shape:"Oval",    fill:"solid",color:"green"},
				{num:1,shape:"Diamond", fill:"solid",color:"red"  },
				{num:2,shape:"Oval",    fill:"solid",color:"blue" },
				{num:3,shape:"Diamond", fill:"solid",color:"blue" },
				{num:2,shape:"Squiggle",fill:"solid",color:"red"  },
				{num:3,shape:"Diamond", fill:"solid",color:"green"},
				{num:3,shape:"Oval",    fill:"solid",color:"blue" },
				{num:1,shape:"Squiggle",fill:"solid",color:"red"  },
				{num:2,shape:"Diamond", fill:"solid",color:"blue" }
			], notPossible: [
				{num:3,shape:"Diamond", fill:"solid",color:"blue" },
				{num:2,shape:"Squiggle",fill:"solid",color:"red"  },
				{num:3,shape:"Oval",    fill:"solid",color:"blue" }
			]}, {board:  [
				{num:3,shape:"Squiggle",fill:"solid",color:"blue" },
				{num:1,shape:"Squiggle",fill:"solid",color:"blue" },
				{num:2,shape:"Diamond", fill:"solid",color:"blue" },
				{num:2,shape:"Oval",    fill:"solid",color:"blue" },
				{num:3,shape:"Oval",    fill:"solid",color:"red"  },
				{num:3,shape:"Diamond", fill:"solid",color:"blue" },
				{num:3,shape:"Oval",    fill:"solid",color:"green"},
				{num:3,shape:"Oval",    fill:"solid",color:"blue" },
				{num:2,shape:"Squiggle",fill:"solid",color:"green"}
			], notPossible: [
				{num:2,shape:"Squiggle",fill:"solid",color:"green"}
			]}, {board:  [
				{num:1,shape:"Oval",    fill:"solid",color:"red"  },
				{num:3,shape:"Diamond", fill:"solid",color:"red"  },
				{num:3,shape:"Squiggle",fill:"solid",color:"blue" },
				{num:3,shape:"Diamond", fill:"solid",color:"green"},
				{num:3,shape:"Oval",    fill:"solid",color:"blue" },
				{num:1,shape:"Diamond", fill:"solid",color:"green"},
				{num:3,shape:"Diamond", fill:"solid",color:"blue" },
				{num:2,shape:"Diamond", fill:"solid",color:"green"},
				{num:1,shape:"Squiggle",fill:"solid",color:"green"}
			], notPossible: [
				{num:1,shape:"Squiggle",fill:"solid",color:"green"}
			]}, {board:  [
				{num:3,shape:"Squiggle",fill:"solid",color:"blue" },
				{num:1,shape:"Diamond", fill:"solid",color:"red"  },
				{num:3,shape:"Diamond", fill:"solid",color:"blue" },
				{num:1,shape:"Oval",    fill:"solid",color:"red"  },
				{num:1,shape:"Oval",    fill:"solid",color:"green"},
				{num:3,shape:"Diamond", fill:"solid",color:"green"},
				{num:3,shape:"Oval",    fill:"solid",color:"green"},
				{num:2,shape:"Diamond", fill:"solid",color:"blue" },
				{num:2,shape:"Diamond", fill:"solid",color:"green"}
			], notPossible: [
				{num:1,shape:"Oval",    fill:"solid",color:"green"},
				{num:3,shape:"Oval",    fill:"solid",color:"green"}
			]}, {board:  [
				{num:3,shape:"Squiggle",fill:"solid",color:"blue" },
				{num:1,shape:"Oval",    fill:"solid",color:"green"},
				{num:3,shape:"Oval",    fill:"solid",color:"blue" },
				{num:1,shape:"Diamond", fill:"solid",color:"blue" },
				{num:2,shape:"Diamond", fill:"solid",color:"green"},
				{num:3,shape:"Squiggle",fill:"solid",color:"green"},
				{num:3,shape:"Oval",    fill:"solid",color:"red"  },
				{num:2,shape:"Squiggle",fill:"solid",color:"green"},
				{num:2,shape:"Squiggle",fill:"solid",color:"blue" }
			], notPossible: [
				{num:3,shape:"Squiggle",fill:"solid",color:"blue" }
			]}, {board:  [
				{num:2,shape:"Diamond", fill:"solid",color:"green"},
				{num:2,shape:"Squiggle",fill:"solid",color:"red"  },
				{num:2,shape:"Squiggle",fill:"solid",color:"blue" },
				{num:3,shape:"Squiggle",fill:"solid",color:"red"  },
				{num:2,shape:"Squiggle",fill:"solid",color:"green"},
				{num:3,shape:"Oval",    fill:"solid",color:"red"  },
				{num:1,shape:"Diamond", fill:"solid",color:"blue" },
				{num:3,shape:"Diamond", fill:"solid",color:"red"  },
				{num:1,shape:"Squiggle",fill:"solid",color:"green"}
			], notPossible: [
				// nothing
			]}, {board:  [
				{num:3,shape:"Oval",    fill:"solid",color:"green"},
				{num:1,shape:"Squiggle",fill:"solid",color:"green"},
				{num:1,shape:"Oval",    fill:"solid",color:"blue" },
				{num:1,shape:"Oval",    fill:"solid",color:"green"},
				{num:3,shape:"Squiggle",fill:"solid",color:"green"},
				{num:3,shape:"Diamond", fill:"solid",color:"red"  },
				{num:3,shape:"Squiggle",fill:"solid",color:"red"  },
				{num:2,shape:"Diamond", fill:"solid",color:"red"  },
				{num:2,shape:"Diamond", fill:"solid",color:"blue" }
			], notPossible: [
				{num:3,shape:"Oval",    fill:"solid",color:"green"},
				{num:1,shape:"Squiggle",fill:"solid",color:"green"},
				{num:3,shape:"Diamond", fill:"solid",color:"red"  }
			]}, {board:  [
				{num:3,shape:"Oval",    fill:"solid",color:"green"},
				{num:3,shape:"Diamond", fill:"solid",color:"blue" },
				{num:3,shape:"Oval",    fill:"solid",color:"blue" },
				{num:1,shape:"Diamond", fill:"solid",color:"red"  },
				{num:3,shape:"Squiggle",fill:"solid",color:"red"  },
				{num:2,shape:"Squiggle",fill:"solid",color:"green"},
				{num:1,shape:"Diamond", fill:"solid",color:"blue" },
				{num:3,shape:"Squiggle",fill:"solid",color:"green"},
				{num:2,shape:"Oval",    fill:"solid",color:"green"}
			], notPossible: [
				{num:3,shape:"Squiggle",fill:"solid",color:"green"}
			]}
		];
	}

	function listNotPossibleCardsOneSelectedDataProvider() {
		return [
			{board: [
				{num:3,shape:"Oval",    fill:"solid",color:"green"},
				{num:2,shape:"Diamond", fill:"solid",color:"green"},
				{num:2,shape:"Squiggle",fill:"solid",color:"red",   isSelected: true},
				{num:3,shape:"Diamond", fill:"solid",color:"green"},
				{num:1,shape:"Oval",    fill:"solid",color:"green"},
				{num:2,shape:"Diamond", fill:"solid",color:"blue" },
				{num:1,shape:"Diamond", fill:"solid",color:"blue" },
				{num:2,shape:"Oval",    fill:"solid",color:"blue" },
				{num:3,shape:"Oval",    fill:"solid",color:"red"  }
			], notPossible: [
				{num:3,shape:"Diamond", fill:"solid",color:"green"},
				{num:1,shape:"Oval",    fill:"solid",color:"green"},
				{num:2,shape:"Diamond", fill:"solid",color:"blue" },
				{num:3,shape:"Oval",    fill:"solid",color:"red"  }
			]}, {board:  [
				{num:1,shape:"Diamond", fill:"solid",color:"blue" },
				{num:2,shape:"Oval",    fill:"solid",color:"red"  },
				{num:2,shape:"Oval",    fill:"solid",color:"blue" },
				{num:2,shape:"Squiggle",fill:"solid",color:"red"  },
				{num:2,shape:"Squiggle",fill:"solid",color:"blue" },
				{num:3,shape:"Oval",    fill:"solid",color:"blue",  isSelected: true},
				{num:1,shape:"Oval",    fill:"solid",color:"green"},
				{num:3,shape:"Squiggle",fill:"solid",color:"green"},
				{num:3,shape:"Diamond", fill:"solid",color:"red"  }
			], notPossible: [
				{num:2,shape:"Oval",    fill:"solid",color:"blue" },
				{num:2,shape:"Squiggle",fill:"solid",color:"red"  }
			]}, {board:  [
				{num:3,shape:"Oval",    fill:"solid",color:"green"},
				{num:1,shape:"Diamond", fill:"solid",color:"red",   isSelected: true},
				{num:2,shape:"Oval",    fill:"solid",color:"blue" },
				{num:3,shape:"Diamond", fill:"solid",color:"blue" },
				{num:2,shape:"Squiggle",fill:"solid",color:"red"  },
				{num:3,shape:"Diamond", fill:"solid",color:"green"},
				{num:3,shape:"Oval",    fill:"solid",color:"blue" },
				{num:1,shape:"Squiggle",fill:"solid",color:"red"  },
				{num:2,shape:"Diamond", fill:"solid",color:"blue" }
			], notPossible: [
				{num:3,shape:"Oval",    fill:"solid",color:"green"},
				{num:2,shape:"Oval",    fill:"solid",color:"blue" },
				{num:3,shape:"Diamond", fill:"solid",color:"blue" },
				{num:2,shape:"Squiggle",fill:"solid",color:"red"  },
				{num:3,shape:"Oval",    fill:"solid",color:"blue" },
				{num:1,shape:"Squiggle",fill:"solid",color:"red"  }
			]}, {board:  [
				{num:3,shape:"Squiggle",fill:"solid",color:"blue" },
				{num:1,shape:"Squiggle",fill:"solid",color:"blue" },
				{num:2,shape:"Diamond", fill:"solid",color:"blue" },
				{num:2,shape:"Oval",    fill:"solid",color:"blue" },
				{num:3,shape:"Oval",    fill:"solid",color:"red",   isSelected: true},
				{num:3,shape:"Diamond", fill:"solid",color:"blue" },
				{num:3,shape:"Oval",    fill:"solid",color:"green"},
				{num:3,shape:"Oval",    fill:"solid",color:"blue" },
				{num:2,shape:"Squiggle",fill:"solid",color:"green"}
			], notPossible: [
				{num:3,shape:"Squiggle",fill:"solid",color:"blue"},
				{num:1,shape:"Squiggle",fill:"solid",color:"blue"},
				{num:2,shape:"Diamond", fill:"solid",color:"blue"},
				{num:2,shape:"Oval",    fill:"solid",color:"blue"},
				{num:3,shape:"Diamond", fill:"solid",color:"blue"},
				{num:2,shape:"Squiggle",fill:"solid",color:"green"}
			]}, {board:  [
				{num:1,shape:"Oval",    fill:"solid",color:"red"  },
				{num:3,shape:"Diamond", fill:"solid",color:"red"  },
				{num:3,shape:"Squiggle",fill:"solid",color:"blue" },
				{num:3,shape:"Diamond", fill:"solid",color:"green"},
				{num:3,shape:"Oval",    fill:"solid",color:"blue" },
				{num:1,shape:"Diamond", fill:"solid",color:"green"},
				{num:3,shape:"Diamond", fill:"solid",color:"blue" },
				{num:2,shape:"Diamond", fill:"solid",color:"green", isSelected: true},
				{num:1,shape:"Squiggle",fill:"solid",color:"green"}
			], notPossible: [
				{num:3,shape:"Diamond", fill:"solid",color:"red"  },
				{num:3,shape:"Oval",    fill:"solid",color:"blue" },
				{num:3,shape:"Diamond", fill:"solid",color:"blue" },
				{num:1,shape:"Squiggle",fill:"solid",color:"green"}
			]}, {board:  [
				{num:3,shape:"Squiggle",fill:"solid",color:"blue" },
				{num:1,shape:"Diamond", fill:"solid",color:"red"  },
				{num:3,shape:"Diamond", fill:"solid",color:"blue" },
				{num:1,shape:"Oval",    fill:"solid",color:"red"  },
				{num:1,shape:"Oval",    fill:"solid",color:"green"},
				{num:3,shape:"Diamond", fill:"solid",color:"green", isSelected: true},
				{num:3,shape:"Oval",    fill:"solid",color:"green"},
				{num:2,shape:"Diamond", fill:"solid",color:"blue" },
				{num:2,shape:"Diamond", fill:"solid",color:"green"}
			], notPossible: [
				{num:3,shape:"Squiggle",fill:"solid",color:"blue" },
				{num:3,shape:"Diamond", fill:"solid",color:"blue" },
				{num:1,shape:"Oval",    fill:"solid",color:"red"  },
				{num:1,shape:"Oval",    fill:"solid",color:"green"},
				{num:3,shape:"Oval",    fill:"solid",color:"green"},
				{num:2,shape:"Diamond", fill:"solid",color:"green"}
			]}, {board:  [
				{num:3,shape:"Squiggle",fill:"solid",color:"blue",  isSelected: true},
				{num:1,shape:"Oval",    fill:"solid",color:"green"},
				{num:3,shape:"Oval",    fill:"solid",color:"blue" },
				{num:1,shape:"Diamond", fill:"solid",color:"blue" },
				{num:2,shape:"Diamond", fill:"solid",color:"green"},
				{num:3,shape:"Squiggle",fill:"solid",color:"green"},
				{num:3,shape:"Oval",    fill:"solid",color:"red"  },
				{num:2,shape:"Squiggle",fill:"solid",color:"green"},
				{num:2,shape:"Squiggle",fill:"solid",color:"blue" }
			], notPossible: [
				{num:3,shape:"Squiggle",fill:"solid",color:"blue", isSelected: true},
				{num:1,shape:"Oval",    fill:"solid",color:"green"},
				{num:3,shape:"Oval",    fill:"solid",color:"blue" },
				{num:1,shape:"Diamond", fill:"solid",color:"blue" },
				{num:2,shape:"Diamond", fill:"solid",color:"green"},
				{num:3,shape:"Squiggle",fill:"solid",color:"green"},
				{num:3,shape:"Oval",    fill:"solid",color:"red"  },
				{num:2,shape:"Squiggle",fill:"solid",color:"green"},
				{num:2,shape:"Squiggle",fill:"solid",color:"blue" }
			]}, {board:  [
				{num:2,shape:"Diamond", fill:"solid",color:"green"},
				{num:2,shape:"Squiggle",fill:"solid",color:"red"  },
				{num:2,shape:"Squiggle",fill:"solid",color:"blue" },
				{num:3,shape:"Squiggle",fill:"solid",color:"red"  },
				{num:2,shape:"Squiggle",fill:"solid",color:"green",  isSelected: true},
				{num:3,shape:"Oval",    fill:"solid",color:"red"  },
				{num:1,shape:"Diamond", fill:"solid",color:"blue" },
				{num:3,shape:"Diamond", fill:"solid",color:"red"  },
				{num:1,shape:"Squiggle",fill:"solid",color:"green"}
			], notPossible: [
				{num:2,shape:"Diamond", fill:"solid",color:"green"},
				{num:3,shape:"Squiggle",fill:"solid",color:"red"  },
				{num:3,shape:"Diamond", fill:"solid",color:"red"  },
				{num:1,shape:"Squiggle",fill:"solid",color:"green"}
			]}, {board:  [
				{num:3,shape:"Oval",    fill:"solid",color:"green"},
				{num:1,shape:"Squiggle",fill:"solid",color:"green"},
				{num:1,shape:"Oval",    fill:"solid",color:"blue" },
				{num:1,shape:"Oval",    fill:"solid",color:"green"},
				{num:3,shape:"Squiggle",fill:"solid",color:"green", isSelected: true},
				{num:3,shape:"Diamond", fill:"solid",color:"red"  },
				{num:3,shape:"Squiggle",fill:"solid",color:"red"  },
				{num:2,shape:"Diamond", fill:"solid",color:"red"  },
				{num:2,shape:"Diamond", fill:"solid",color:"blue" }
			], notPossible: [
				{num:3,shape:"Oval",    fill:"solid",color:"green"},
				{num:1,shape:"Squiggle",fill:"solid",color:"green"},
				{num:1,shape:"Oval",    fill:"solid",color:"green"},
				{num:3,shape:"Diamond", fill:"solid",color:"red"  },
				{num:3,shape:"Squiggle",fill:"solid",color:"red"  },
				{num:2,shape:"Diamond", fill:"solid",color:"blue" }
			]}, {board:  [
				{num:3,shape:"Oval",    fill:"solid",color:"green"},
				{num:3,shape:"Diamond", fill:"solid",color:"blue" },
				{num:3,shape:"Oval",    fill:"solid",color:"blue" },
				{num:1,shape:"Diamond", fill:"solid",color:"red"  },
				{num:3,shape:"Squiggle",fill:"solid",color:"red"  },
				{num:2,shape:"Squiggle",fill:"solid",color:"green", isSelected: true},
				{num:1,shape:"Diamond", fill:"solid",color:"blue" },
				{num:3,shape:"Squiggle",fill:"solid",color:"green"},
				{num:2,shape:"Oval",    fill:"solid",color:"green"}
			], notPossible: [
				{num:3,shape:"Oval",    fill:"solid",color:"green"},
				{num:3,shape:"Diamond", fill:"solid",color:"blue" },
				{num:3,shape:"Squiggle",fill:"solid",color:"red"  },
				{num:1,shape:"Diamond", fill:"solid",color:"blue" },
				{num:3,shape:"Squiggle",fill:"solid",color:"green"},
				{num:2,shape:"Oval",    fill:"solid",color:"green"}
			]}
		];
	}

	function listNotPossibleCardsTwoSelectedDataProvider() {
		return [
			{board: [
				{num:3,shape:"Oval",    fill:"solid",color:"green", isSelected: true},
				{num:2,shape:"Diamond", fill:"solid",color:"green"},
				{num:2,shape:"Squiggle",fill:"solid",color:"red",   isSelected: true},
				{num:3,shape:"Diamond", fill:"solid",color:"green"},
				{num:1,shape:"Oval",    fill:"solid",color:"green"},
				{num:2,shape:"Diamond", fill:"solid",color:"blue" },
				{num:1,shape:"Diamond", fill:"solid",color:"blue" },
				{num:2,shape:"Oval",    fill:"solid",color:"blue" },
				{num:3,shape:"Oval",    fill:"solid",color:"red"  }
			], notPossible: [
				{num:2,shape:"Diamond", fill:"solid",color:"green"},
				{num:3,shape:"Diamond", fill:"solid",color:"green"},
				{num:1,shape:"Oval",    fill:"solid",color:"green"},
				{num:2,shape:"Diamond", fill:"solid",color:"blue" },
				{num:2,shape:"Oval",    fill:"solid",color:"blue" },
				{num:3,shape:"Oval",    fill:"solid",color:"red"  }
			]}, {board:  [
				{num:1,shape:"Diamond", fill:"solid",color:"blue" },
				{num:2,shape:"Oval",    fill:"solid",color:"red"  },
				{num:2,shape:"Oval",    fill:"solid",color:"blue" },
				{num:2,shape:"Squiggle",fill:"solid",color:"red"  },
				{num:2,shape:"Squiggle",fill:"solid",color:"blue",  isSelected: true},
				{num:3,shape:"Oval",    fill:"solid",color:"blue",  isSelected: true},
				{num:1,shape:"Oval",    fill:"solid",color:"green"},
				{num:3,shape:"Squiggle",fill:"solid",color:"green"},
				{num:3,shape:"Diamond", fill:"solid",color:"red"  }
			], notPossible: [
				{num:2,shape:"Oval",    fill:"solid",color:"red"  },
				{num:2,shape:"Oval",    fill:"solid",color:"blue" },
				{num:2,shape:"Squiggle",fill:"solid",color:"red"  },
				{num:1,shape:"Oval",    fill:"solid",color:"green"},
				{num:3,shape:"Squiggle",fill:"solid",color:"green"},
				{num:3,shape:"Diamond", fill:"solid",color:"red"  }
			]}, {board:  [
				{num:3,shape:"Oval",    fill:"solid",color:"green"},
				{num:1,shape:"Diamond", fill:"solid",color:"red",   isSelected: true},
				{num:2,shape:"Oval",    fill:"solid",color:"blue" },
				{num:3,shape:"Diamond", fill:"solid",color:"blue" },
				{num:2,shape:"Squiggle",fill:"solid",color:"red"  },
				{num:3,shape:"Diamond", fill:"solid",color:"green", isSelected: true},
				{num:3,shape:"Oval",    fill:"solid",color:"blue" },
				{num:1,shape:"Squiggle",fill:"solid",color:"red"  },
				{num:2,shape:"Diamond", fill:"solid",color:"blue" }
			], notPossible: [
				{num:3,shape:"Oval",    fill:"solid",color:"green"},
				{num:2,shape:"Oval",    fill:"solid",color:"blue"},
				{num:3,shape:"Diamond", fill:"solid",color:"blue"},
				{num:2,shape:"Squiggle",fill:"solid",color:"red"},
				{num:3,shape:"Oval",    fill:"solid",color:"blue"},
				{num:1,shape:"Squiggle",fill:"solid",color:"red"}
			]}, {board:  [
				{num:3,shape:"Squiggle",fill:"solid",color:"blue" },
				{num:1,shape:"Squiggle",fill:"solid",color:"blue" },
				{num:2,shape:"Diamond", fill:"solid",color:"blue" },
				{num:2,shape:"Oval",    fill:"solid",color:"blue" },
				{num:3,shape:"Oval",    fill:"solid",color:"red",   isSelected: true},
				{num:3,shape:"Diamond", fill:"solid",color:"blue" },
				{num:3,shape:"Oval",    fill:"solid",color:"green", isSelected: true},
				{num:3,shape:"Oval",    fill:"solid",color:"blue" },
				{num:2,shape:"Squiggle",fill:"solid",color:"green"}
			], notPossible: [
				{num:3,shape:"Squiggle",fill:"solid",color:"blue"},
				{num:1,shape:"Squiggle",fill:"solid",color:"blue"},
				{num:2,shape:"Diamond", fill:"solid",color:"blue"},
				{num:2,shape:"Oval",    fill:"solid",color:"blue"},
				{num:3,shape:"Diamond", fill:"solid",color:"blue"},
				{num:2,shape:"Squiggle",fill:"solid",color:"green"}
			]}, {board:  [
				{num:1,shape:"Oval",    fill:"solid",color:"red"  },
				{num:3,shape:"Diamond", fill:"solid",color:"red"  },
				{num:3,shape:"Squiggle",fill:"solid",color:"blue" },
				{num:3,shape:"Diamond", fill:"solid",color:"green", isSelected: true},
				{num:3,shape:"Oval",    fill:"solid",color:"blue" },
				{num:1,shape:"Diamond", fill:"solid",color:"green"},
				{num:3,shape:"Diamond", fill:"solid",color:"blue" },
				{num:2,shape:"Diamond", fill:"solid",color:"green", isSelected: true},
				{num:1,shape:"Squiggle",fill:"solid",color:"green"}
			], notPossible: [
				{num:1,shape:"Oval",    fill:"solid",color:"red"  },
				{num:3,shape:"Diamond", fill:"solid",color:"red"  },
				{num:3,shape:"Squiggle",fill:"solid",color:"blue" },
				{num:3,shape:"Oval",    fill:"solid",color:"blue" },
				{num:3,shape:"Diamond", fill:"solid",color:"blue" },
				{num:1,shape:"Squiggle",fill:"solid",color:"green"}
			]}, {board:  [
				{num:3,shape:"Squiggle",fill:"solid",color:"blue" },
				{num:1,shape:"Diamond", fill:"solid",color:"red",   isSelected: true},
				{num:3,shape:"Diamond", fill:"solid",color:"blue" },
				{num:1,shape:"Oval",    fill:"solid",color:"red"  },
				{num:1,shape:"Oval",    fill:"solid",color:"green"},
				{num:3,shape:"Diamond", fill:"solid",color:"green", isSelected: true},
				{num:3,shape:"Oval",    fill:"solid",color:"green"},
				{num:2,shape:"Diamond", fill:"solid",color:"blue" },
				{num:2,shape:"Diamond", fill:"solid",color:"green"}
			], notPossible: [
				{num:3,shape:"Squiggle",fill:"solid",color:"blue" },
				{num:3,shape:"Diamond", fill:"solid",color:"blue" },
				{num:1,shape:"Oval",    fill:"solid",color:"red"  },
				{num:1,shape:"Oval",    fill:"solid",color:"green"},
				{num:3,shape:"Oval",    fill:"solid",color:"green"},
				{num:2,shape:"Diamond", fill:"solid",color:"green"}
			]}, {board:  [
				{num:3,shape:"Squiggle",fill:"solid",color:"blue",  isSelected: true},
				{num:1,shape:"Oval",    fill:"solid",color:"green", isSelected: true},
				{num:3,shape:"Oval",    fill:"solid",color:"blue" },
				{num:1,shape:"Diamond", fill:"solid",color:"blue" },
				{num:2,shape:"Diamond", fill:"solid",color:"green"},
				{num:3,shape:"Squiggle",fill:"solid",color:"green"},
				{num:3,shape:"Oval",    fill:"solid",color:"red"  },
				{num:2,shape:"Squiggle",fill:"solid",color:"green"},
				{num:2,shape:"Squiggle",fill:"solid",color:"blue" }
			], notPossible: [
				{num:3,shape:"Squiggle",fill:"solid",color:"blue",  isSelected: true},
				{num:1,shape:"Oval",    fill:"solid",color:"green", isSelected: true},
				{num:3,shape:"Oval",    fill:"solid",color:"blue" },
				{num:1,shape:"Diamond", fill:"solid",color:"blue" },
				{num:2,shape:"Diamond", fill:"solid",color:"green"},
				{num:3,shape:"Squiggle",fill:"solid",color:"green"},
				{num:3,shape:"Oval",    fill:"solid",color:"red"  },
				{num:2,shape:"Squiggle",fill:"solid",color:"green"},
				{num:2,shape:"Squiggle",fill:"solid",color:"blue" }
			]}, {board:  [
				{num:2,shape:"Diamond", fill:"solid",color:"green"},
				{num:2,shape:"Squiggle",fill:"solid",color:"red",   isSelected: true},
				{num:2,shape:"Squiggle",fill:"solid",color:"blue" },
				{num:3,shape:"Squiggle",fill:"solid",color:"red"  },
				{num:2,shape:"Squiggle",fill:"solid",color:"green", isSelected: true},
				{num:3,shape:"Oval",    fill:"solid",color:"red"  },
				{num:1,shape:"Diamond", fill:"solid",color:"blue" },
				{num:3,shape:"Diamond", fill:"solid",color:"red"  },
				{num:1,shape:"Squiggle",fill:"solid",color:"green"}
			], notPossible: [
				{num:2,shape:"Diamond", fill:"solid",color:"green"},
				{num:3,shape:"Squiggle",fill:"solid",color:"red"  },
				{num:3,shape:"Oval",    fill:"solid",color:"red"  },
				{num:1,shape:"Diamond", fill:"solid",color:"blue" },
				{num:3,shape:"Diamond", fill:"solid",color:"red"  },
				{num:1,shape:"Squiggle",fill:"solid",color:"green"}
			]}, {board:  [
				{num:3,shape:"Oval",    fill:"solid",color:"green"},
				{num:1,shape:"Squiggle",fill:"solid",color:"green"},
				{num:1,shape:"Oval",    fill:"solid",color:"blue",  isSelected: true},
				{num:1,shape:"Oval",    fill:"solid",color:"green"},
				{num:3,shape:"Squiggle",fill:"solid",color:"green", isSelected: true},
				{num:3,shape:"Diamond", fill:"solid",color:"red"  },
				{num:3,shape:"Squiggle",fill:"solid",color:"red"  },
				{num:2,shape:"Diamond", fill:"solid",color:"red"  },
				{num:2,shape:"Diamond", fill:"solid",color:"blue" }
			], notPossible: [
				{num:3,shape:"Oval",    fill:"solid",color:"green"},
				{num:1,shape:"Squiggle",fill:"solid",color:"green"},
				{num:1,shape:"Oval",    fill:"solid",color:"green"},
				{num:3,shape:"Diamond", fill:"solid",color:"red"  },
				{num:3,shape:"Squiggle",fill:"solid",color:"red"  },
				{num:2,shape:"Diamond", fill:"solid",color:"blue" }
			]}, {board:  [
				{num:3,shape:"Oval",    fill:"solid",color:"green"},
				{num:3,shape:"Diamond", fill:"solid",color:"blue" },
				{num:3,shape:"Oval",    fill:"solid",color:"blue",  isSelected: true},
				{num:1,shape:"Diamond", fill:"solid",color:"red"  },
				{num:3,shape:"Squiggle",fill:"solid",color:"red"  },
				{num:2,shape:"Squiggle",fill:"solid",color:"green", isSelected: true},
				{num:1,shape:"Diamond", fill:"solid",color:"blue" },
				{num:3,shape:"Squiggle",fill:"solid",color:"green"},
				{num:2,shape:"Oval",    fill:"solid",color:"green"}
			], notPossible: [
				{num:3,shape:"Oval",    fill:"solid",color:"green"},
				{num:3,shape:"Diamond", fill:"solid",color:"blue" },
				{num:3,shape:"Squiggle",fill:"solid",color:"red"  },
				{num:1,shape:"Diamond", fill:"solid",color:"blue" },
				{num:3,shape:"Squiggle",fill:"solid",color:"green"},
				{num:2,shape:"Oval",    fill:"solid",color:"green"}
			]}
		];
	}
});
</script>

</head>
<body>
	<div id="qunit"></div>
	<div id="qunit-fixture">test markup, will be hidden</div>
</body>
</html>
