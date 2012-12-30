<?php
class Cache_JS extends Cache
{
	public function __construct(AssetBuilder $builder)
	{
		parent::__construct('main.js', $builder);
	}

	public function __toString()
	{
		return sprintf("<script src=\"%s?%d\"></script>\n",
			$this->_url, filemtime($this->_file));
	}
}
