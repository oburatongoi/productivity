<?php

namespace Oburatongoi\Productivity\Repositories;

use App\User;
use Oburatongoi\Productivity\Folder;

class FolderRepository {

    public function forUser(User $user)
    {
        // return $user->folders()->with('checklists', 'goals', 'notes', 'subfolders')->orderBy('updated_at', 'desc')->get();
        return $user->folders()->with('checklists', 'subfolders')->orderBy('updated_at', 'desc')->get();
    }

    public function rootForUser(User $user)
    {
        return $user->folders()
                    ->whereNull('parent_id')
                    ->orderBy('updated_at', 'desc')
                    ->get();
    }

    public function rootForFolder(Folder $folder)
    {
        return $folder->subfolders()
                    ->orderBy('updated_at', 'desc')
                    ->get();
    }

}
