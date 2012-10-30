<!DOCTYPE html>
<html>
<head>
<link href="../../lib/qunit.css" rel="stylesheet" type="text/css" media="screen" />
<script src="../../lib/qunit.js"></script>
<script src="../../lib/jquery-1.7.2.min.js"></script>
<script src="../../lib/underscore-1.4.2.min.js"></script>
<script src="../../lib/backbone-0.9.2.min.js"></script>

<script src="../../models/Card.js"></script>
<script src="../../collections/Board.js"></script>

<script src="../../views/bases/ParentView.js"></script>
<script src="../../views/Slot.js"></script>
<script src="../../views/Board.js"></script>

<script>
"use strict";

$(document).ready(function () {
	module('Views.Board');

	// test('Can make a board', function() {
	// 	var rows = 3,
	// 		cols = 3,
	// 		board = SetsUI.makeBoard(rows, cols);

	// 	var $board = $(board);
	// 	equal(board.nodeName, 'TABLE', 'Should have created a table');
	// 	equal($board.find('tr').length, rows, 'should have all the rows');
	// 	equal($board.find('td').length, rows * cols, 'should have all the rows and cols');
	// });

});
</script>

</head>
<body>
	<div id="qunit"></div>
	<div id="qunit-fixture">test markup, will be hidden</div>
</body>
</html>
