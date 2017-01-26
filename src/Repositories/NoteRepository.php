<?php

namespace Oburatongoi\Productivity\Repositories;

use App\User;
use Oburatongoi\Productivity\Folder;

class NoteRepository {

    public function forUser(User $user)
    {
        return $user->notes()->orderBy('updated_at', 'desc')->get();
    }

    public function rootForUser(User $user)
    {
        return $user->notes()->whereNull('folder_id')->orderBy('updated_at', 'desc')->get();
    }

    public function forFolder(Folder $folder)
    {
        return $folder->notes()->orderBy('updated_at', 'desc')->get();
    }

}
