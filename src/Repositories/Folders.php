<?php

namespace Oburatongoi\Productivity\Repositories;

use App\User;
use Oburatongoi\Productivity\Folder;
use Oburatongoi\Productivity\Interfaces\FoldersInterface;

class Folders implements FoldersInterface {

    public function forUser(User $user)
    {
        return $user->folders()->with('checklists', 'subfolders')->orderBy('name', 'asc')->get();
    }

    public function rootForUser(User $user)
    {
        return $user->folders()
                    ->whereNull('folder_id')
                    // ->orderBy('name', 'desc') // doestn work since values are encrypted
                    ->get();

    }

    public function rootForFolder(User $user, Folder $folder)
    {
        return $folder->subfolders()
                    ->orderBy('name', 'desc')
                    ->get();
    }

}
