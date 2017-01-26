<?php

namespace Oburatongoi\Productivity\Repositories;


use App\User;
use Oburatongoi\Productivity\Folder;

class ChecklistRepository {

    public function forUser(User $user)
    {
        return $user->checklists()->orderBy('updated_at', 'desc')->get();
    }

    public function rootForUser(User $user)
    {
        return $user->checklists()->whereNull('folder_id')->orderBy('updated_at', 'desc')->get();
    }

    public function forFolder(Folder $folder)
    {
        return $folder->checklists()->orderBy('updated_at', 'desc')->get();
    }

}
