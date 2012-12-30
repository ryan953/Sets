<?php
class AssetBuilder_Dynamic extends AssetBuilder
{
	public function prepare($file)
	{
		ftruncate(fopen($file, 'w'), 0);
	}

	public function append($fromPath, $toFile)
	{
		file_put_contents($toFile, file_get_contents($fromPath), FILE_APPEND);
	}
}
