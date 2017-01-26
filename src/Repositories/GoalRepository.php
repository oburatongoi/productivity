<?php

namespace Oburatongoi\Productivity\Repositories;

use App\User;
use Oburatongoi\Productivity\Folder;

class GoalRepository {

    public function forUser(User $user)
    {
        return $user->goals()->orderBy('updated_at', 'desc')->get();
    }

    public function rootForUser(User $user)
    {
        return $user->goals()->whereNull('folder_id')->orderBy('updated_at', 'desc')->get();
    }

    public function forFolder(Folder $folder)
    {
        return $folder->goals()->orderBy('updated_at', 'desc')->get();
    }

}
