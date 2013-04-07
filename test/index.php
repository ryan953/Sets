<!DOCTYPE html>
<html lang="en">
<head>
<?php
function iterator_keys($iterator) {
	$keys = array();
	foreach($iterator as $key=>$value) {
		$keys[] = $key;
	}
	return $keys;
}
?>
	<meta charset="UTF-8" />
	<title>Sets! QUnit Test Suite</title>
	<link rel="stylesheet" href="../lib/qunit-1.11.0.css" type="text/css" media="screen" />
	<link rel="stylesheet" href="../lib/qunit-composite.css">
	<script src="../lib/qunit-1.11.0.js"></script>
	<script src="../lib/qunit-composite.js"></script>

	<?php
	$dir = '.';

	$files = new RecursiveIteratorIterator(
		new RecursiveDirectoryIterator($dir));

	$tests = array_values(
		array_diff(
			iterator_keys($files), array(
				'./index.php',
				'./assistant.html',
				'./cards.html',
				'./game.html',
				'./sets.html',
			)
		)
	);
	?>
	<script>
	QUnit.testSuites(
		<?php echo json_encode($tests) . "\n"; ?>
	);
	</script>
</head>
<body>
	<div id="qunit"></div>
	<div id="qunit-fixture"></div>

	<a href="./cards.html">Card Drawing Test</a>
</body>
</html>
