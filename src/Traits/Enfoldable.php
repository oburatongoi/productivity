<?php namespace Oburatongoi\Productivity\Traits;

use Oburatongoi\Productivity\Folder;

use Auth;

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

    public function moveToFolder(Folder $folder)
    {
        if (Auth::user()->can('modify', $this)) {

            return $this->folder()->associate($folder)->save();
        }
    }

    public function moveToHome()
    {

        if (Auth::user()->can('modify', $this)) {

            if ($this instanceof Folder) return $this->saveAsRoot();

            return $this->update(['folder_id' => null]);
        }
    }

}
