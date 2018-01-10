<?php namespace Oburatongoi\Productivity\Traits;

use Oburatongoi\Productivity\Folder;

use Auth;

trait Enfoldable
{

    public function folder()
    {
      $foreign_key = $this instanceof Folder ? 'parent_id' : 'folder_id';
      return $this->belongsTo('Oburatongoi\Productivity\Folder', $foreign_key);
    }

    public function getFolderById()
    {
      $parentId = $this instanceof Folder ? $this->parent_id : $this->folder_id;
      return $this->folder()->where('id', $parentId)->first();
    }

    public function getFolderTree()
    {
        if ($folder = $this->getFolderById()) {
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
