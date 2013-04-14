<!DOCTYPE html>
<html>
<head>

<link href="../../lib/qunit.css" rel="stylesheet" type="text/css" media="screen" />
<script src="../../lib/qunit.js"></script>
<script src="../../lib/jquery-1.9.1.min.js"></script>
<script src="../../lib/underscore-1.4.4.min.js"></script>
<script src="../../lib/backbone-1.0.0.min.js"></script>

<script src="../../models/Card.js"></script>
<script src="../../models/Slot.js"></script>
<script src="../../collections/Board.js"></script>

<script>
"use strict";

$(document).ready(function () {
	module('Collections.Board');
	// test('Creating a card', function() {
	// 	var c = new Models.Card();
	// 	ok(c, "new card created successfully");
	// });

	// test('Card.factory() builds a card', function() {
	// 	var props = {
	// 		count: 2,
	// 		shape: 'Oval',
	// 		fill: 'solid',
	// 		color: 'blue'
	// 	};
	// 	var card = new Card(2, 'Oval', 'solid', 'blue');
	// 	deepEqual(Card.factory(props), card, 'Factory can build cards correctly');

	// });

	// test('isEmpty works correctly', function () {
	// 	ok(new Card().isEmpty(), "A card with no params IS empty");
	// 	ok(new Card( 1, "Oval", "striped").isEmpty(), "A card with only 3 params IS empty");

	// 	ok(!(new Card( 1, "Oval", "striped", "green").isEmpty()), "A card with all 4 params is NOT empty");
	// });

	// test('select/deselect', function() {
	// 	var c = new Card();

	// 	c.select();
	// 	ok(c.isSelected, 'card gets selected');
	// 	c.deselect();
	// 	ok(!c.isSelected, 'card gets UNselected');
	// });

	// test('getClassAttr', function() {
	// 	Card.classNameMap.attr_one = 'class-one';
	// 	Card.classNameMap.attr_two = 'class-two';

	// 	var c = new Card();
	// 	equal('', c.getClassAttr(), 'should have no clasname');

	// 	c.attr_one = true;
	// 	equal('class-one', c.getClassAttr(), 'should now have a classname');

	// 	c.attr_two = true;
	// 	equal('class-one class-two', c.getClassAttr(), 'should have two classnames');
	// });

	module('Collection.Board::isASet');
	test('isASet is detecting correctly', function() {
		var diff_color = [
			{num: 1, shape:"Oval", fill:"striped", color:"green"},
			{num: 1, shape:"Oval", fill:"striped", color:"red"},
			{num: 1, shape:"Oval", fill:"striped", color:"blue"}
		],
		diff_color_shape = [
			{num: 1, shape:"Diamond", fill:"striped", color:"green"},
			{num: 1, shape:"Oval", fill:"striped", color:"red"},
			{num: 1, shape:"Squiggle", fill:"striped", color:"blue"}
		],
		diff_color_shape_count = [
			{num: 1, shape:"Diamond", fill:"striped", color:"green"},
			{num: 2, shape:"Oval", fill:"striped", color:"red"},
			{num: 3, shape:"Squiggle", fill:"striped", color:"blue"}
		];

		equal(true, Collections.Board.isASet(diff_color), 'Detected a set where card COLORS differ');
		equal(true, Collections.Board.isASet(diff_color_shape), 'Detected a set where card COLORS differ, and SHAPE ');
		equal(true, Collections.Board.isASet(diff_color_shape_count), 'Detected a set where card COLORS differ, and SHAPE, and COUNT');
	});

	test('isASet is failing correctly', function() {
		var diff_color = [
			{num: 1, shape:"Oval", fill:"striped", color:"green"},
			{num: 1, shape:"Oval", fill:"striped", color:"green"},
			{num: 1, shape:"Oval", fill:"striped", color:"blue"}
		],
		diff_color_shape = [
			{num: 1, shape:"Oval", fill:"striped", color:"green"},
			{num: 1, shape:"Oval", fill:"striped", color:"green"},
			{num: 1, shape:"Diamond", fill:"striped", color:"blue"}
		],
		four_cards = [{}, {}, {}, {}],
		two_cards = [{}, {}],
		one_card = [{}];

		equal(false, Collections.Board.isASet(diff_color), "Two colors are the same, one different");
		equal(false, Collections.Board.isASet(diff_color_shape), "Two colors are the same, one different + Two shapes same, one different");
		equal(false, Collections.Board.isASet(four_cards), "Four cards passed in");
		equal(false, Collections.Board.isASet(two_cards), "Only two cards passed in");
		equal(false, Collections.Board.isASet(one_card), "Only one card passed in");
	});


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
		board.resetNotPossibleSlots();
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
