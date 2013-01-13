<?php
class AssetBuilder
{
	public static function factory($precompiled = false)
	{
		if ($precompiled) {
			return new AssetBuilder();
		} else {
			return new AssetBuilder_Dynamic();
		}
	}

	public function prepare($file)
	{
		// no-op
	}

	public function append($fromPath, $toFile)
	{
		// no-op
	}
}
