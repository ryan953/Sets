<?php
class Cache_CSS extends Cache
{
	public function __construct(AssetBuilder $builder)
	{
		parent::__construct('styles.css', $builder);
	}

	public function __toString()
	{
		return sprintf("<link rel=\"stylesheet\" href=\"%s?%d\" type=\"text/css\"/>\n",
			$this->_url, filemtime($this->_file));
	}
}
