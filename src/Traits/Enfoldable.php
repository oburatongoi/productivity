<?php namespace Oburatongoi\Productivity\Traits;

trait Enfoldable
{
    public function folder()
    {
      return $this->belongsTo('Oburatongoi\Productivity\Folder', 'folder_id');
    }

    public function folderById()
    {
        return $this->folder()->where('id', $this->folder_id)->first();
    }

    public function getFolderTree()
    {
        if ($folder = $this->folderById()) {
            $ancestors = $folder->getAncestors();
            return $ancestors->push($folder);
        }

        return null;
    }

}
