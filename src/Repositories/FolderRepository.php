<?php

namespace Oburatongoi\Productivity\Repositories;

use App\User;
use Oburatongoi\Productivity\Folder;

class FolderRepository {

    public function forUser(User $user)
    {
        // return $user->folders()->with('checklists', 'goals', 'notes', 'subfolders')->orderBy('name', 'asc')->get();
        return $user->folders()->with('checklists', 'subfolders')->orderBy('name', 'asc')->get();
    }

    public function rootForUser(User $user)
    {
        return $user->folders()
                    ->whereNull('folder_id')
                    ->orderBy('name', 'asc')
                    ->get();
    }

    public function rootForFolder(Folder $folder)
    {
        return $folder->subfolders()
                    ->orderBy('name', 'asc')
                    ->get();
    }

}
