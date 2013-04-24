<!DOCTYPE html>
<html>
<head>
<title>Test: collections/Board.js</title>

<link href="../../lib/qunit.css" rel="stylesheet" type="text/css" media="screen" />
<script src="../../lib/qunit.js"></script>
<script src="../../lib/jquery.min.js"></script>
<script src="../../lib/underscore.min.js"></script>
<script src="../../lib/backbone.min.js"></script>

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
});
</script>

</head>
<body>
	<div id="qunit"></div>
	<div id="qunit-fixture">test markup, will be hidden</div>
</body>
</html>
