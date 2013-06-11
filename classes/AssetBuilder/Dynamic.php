<?php
class AssetBuilder_Dynamic extends AssetBuilder
{
	public function prepare($file)
	{
		ftruncate(fopen($file, 'w'), 0);
	}

	public function append($fromPath, $toFile)
	{
		$contents = file_get_contents($this->_resolvePath($fromPath));
		file_put_contents($toFile, $contents, FILE_APPEND);
	}
}
