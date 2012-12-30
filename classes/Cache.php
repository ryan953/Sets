<?php

class Cache
{
	public static $publicDir = './compiled';
	public static $cacheFolder = './compiled';

	protected $_file;
	protected $_concat = '';

	protected function __construct($filename, AssetBuilder $builder)
	{
		$this->_url = static::$publicDir . '/' . $filename;
		$this->_file = static::$publicDir . '/' . $filename;
		$this->_builder = $builder;

		$this->_builder->prepare($this->_file);
	}

	public function __invoke($fromPath)
	{
		$this->_builder->append($fromPath, $this->_file);
	}
}
