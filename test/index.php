<!doctype html>
<html lang="en">
<head>
	<meta charset="UTF-8" />
	<title>Sets! QUnit Test Suite</title>
	<link rel="stylesheet" href="../lib/qunit.css" type="text/css" media="screen" />
	<link rel="stylesheet" href="qunit-composite.css">	
	<script src="../lib/qunit.js"></script>
	<script src="qunit-composite.js"></script>

	<script>
	QUnit.testSuites([
		"./logic.html",
		"./logic-setsui.html",
		"./assistant.html"
   	]);
	</script>
</head>
<body>
	<div id="qunit"></div>
	<div id="qunit-fixture"></div>

	<a href="./cards.html">Card Drawing Test</a>
</body>
</html>
