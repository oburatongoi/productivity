<?php

namespace Oburatongoi\Productivity\Repositories;

use App\User;
use Oburatongoi\Productivity\Folder;
use Oburatongoi\Productivity\Interfaces\FoldersInterface;

class Folders implements FoldersInterface {

    public function forUser(User $user)
    {
        return $user->folders()
                    ->with('checklists:id,fake_id,title,folder_id', 'subfolders:id,fake_id,name,parent_id')
                    ->orderBy('name', 'asc')
                    ->get();
    }

    public function rootForUser(User $user)
    {
        return $user->folders()
                    ->whereNull('parent_id')
                    ->with('checklists:id,fake_id,title,folder_id', 'subfolders:id,fake_id,name,parent_id')
                    ->get();

    }

    public function rootForFolder(User $user, Folder $folder)
    {
        return $folder->subfolders()
                      ->with('checklists:id,fake_id,title,folder_id', 'subfolders:id,fake_id,name,parent_id')
                      ->get();
    }

    public function getKanbanDescendants($nestedKanban)
    {
      $folder = Folder::where('id', $nestedKanban['id'])
                    ->with('checklists:id,fake_id,title,folder_id', 'subfolders:id,fake_id,name,parent_id')
                    ->first();

      return [
        'checklists' => $folder->checklists,
        'subfolders' => $folder->subfolders
      ];
    }

}
