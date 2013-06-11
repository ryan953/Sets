<?php
class AssetBuilder
{
	protected $_basePath;

	public static function factory($basePath = '', $precompiled = false)
	{
		if ($precompiled) {
			return new AssetBuilder($basePath);
		} else {
			return new AssetBuilder_Dynamic($basePath);
		}
	}

	public function __construct($basePath)
	{
		$this->_basePath = $basePath;
	}

	public function prepare($file)
	{
		// no-op
	}

	public function append($fromPath, $toFile)
	{
		// no-op
	}

	protected function _resolvePath($path)
	{
		$parts = array($path);
		if (!empty($this->_basePath)) {
			array_unshift($parts, $this->_basePath);
		}
		return join($parts, '/');
	}
}
