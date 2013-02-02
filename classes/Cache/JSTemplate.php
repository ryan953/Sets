<?php
class Cache_JSTemplate extends Cache
{
	public function __construct(AssetBuilder $builder)
	{
		parent::__construct('templates.html', $builder);
	}

	public function __toString()
	{
		return file_get_contents($this->_file);
	}
}
