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
