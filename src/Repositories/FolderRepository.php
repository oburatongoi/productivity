<?php

namespace Oburatongoi\Productivity\Repositories;

use App\User;
use Oburatongoi\Productivity\Folder;
// use DB;

class FolderRepository {

    public function forUser(User $user)
    {
        return $user->folders()->with('checklists', 'subfolders')->orderBy('name', 'asc')->get();
    }

    public function rootForUser(User $user)
    {
        return $user->folders()
                    ->whereNull('folder_id')
                    ->orderBy('name', 'desc')
                    ->get();
    }

    public function rootForFolder(Folder $folder)
    {
        return $folder->subfolders()
                    ->orderBy('name', 'desc')
                    ->get();
    }

    public function missingFakeId()
    {
        return Folder::whereNull('fake_id')->get();
    }

}
