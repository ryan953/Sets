<?php
class AssetBuilder_JSTemplate extends AssetBuilder_Dynamic
{
	public function append($fromPath, $toFile)
	{
		$fromPath = $this->_resolvePath($fromPath);
		$id = pathinfo($fromPath, PATHINFO_FILENAME);
		$template = file_get_contents($fromPath);
		$html = "<script type='text/html' id='{$id}'>\n{$template}\n</script>\n\n";
		file_put_contents($toFile, $html, FILE_APPEND);
	}
}
