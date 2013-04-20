<!DOCTYPE html>
<html>
<head>
<title>Test: collections/Deck.js</title>

<link href="../../lib/qunit.css" rel="stylesheet" type="text/css" media="screen" />
<script src="../../lib/qunit.js"></script>
<script src="../../lib/jquery.min.js"></script>
<script src="../../lib/underscore.min.js"></script>
<script src="../../lib/backbone.min.js"></script>

<script src="../../models/Card.js"></script>
<script src="../../collections/Deck.js"></script>

<script>
"use strict";

$(document).ready(function () {
	module('Collections.Deck');

	test('Deck has some modes', function() {
		equal('normal', Collections.Deck.NORMAL);
		equal('easy', Collections.Deck.EASY);
	});

	test('A Deck is created', function() {
		var deck = new Collections.Deck();

		ok(!deck.hasCards(), 'should not have cards yet');
		equal(0, deck.length);
		equal(0, deck.startingLength);
	});

	test('Rebuild a deck', function() {
		var deck = new Collections.Deck();

		deck = new Collections.Deck();
		deck.rebuild(Collections.Deck.NORMAL);
		equal(3*3*3*3, deck.length, 'the size of the deck is reported');
		equal('normal', deck._mode, 'mode sets when passed');

		deck.buildCards();
		equal(3*3*3*3, deck.length, 'the size of the deck is reported');
		equal('normal', deck._mode, 'mode sets when passed');
	});

	test('Deck can switch between modes', function() {
		var deck = new Collections.Deck();

		deck = new Collections.Deck();
		deck.rebuild(Collections.Deck.NORMAL);
		equal(3*3*3*3, deck.length, 'the size of the deck is reported');
		equal('normal', deck._mode, 'mode sets when passed');

		deck.rebuild(Collections.Deck.EASY);
		equal(3*3*3, deck.length, 'the size of the deck is reported');
		equal('easy', deck._mode, 'mode sets when passed');
	});

	test('A card can be picked from a deck', function() {
		var deck = new Collections.Deck(),
			card;

		deck.rebuild(Collections.Deck.oneSetExpandFail);
		card = deck.drawCard();
		ok(card instanceof(Models.Card), 'Picked the first card');
		equal( deck.startingLength - 1, deck.length, 'the picked card was removed from the deck');

		deck.rebuild(Collections.Deck.NORMAL);
		card = deck.drawCard();
		ok(card instanceof(Models.Card), 'Picked a random card');
		equal( deck.startingLength - 1, deck.length, 'the picked card was removed from the deck');
	});

});
</script>

</head>
<body>
	<div id="qunit"></div>
	<div id="qunit-fixture">test markup, will be hidden</div>
</body>
</html>
