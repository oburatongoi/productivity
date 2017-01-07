<?php

namespace Oburatongoi\Productivity\Repositories;

use Oburatongoi\Productivity\User;
use Oburatongoi\Productivity\Folder;

class NoteRepository {

    public function forUser(User $user)
    {
        return $user->notes()->get();
    }

    public function forFolder(Folder $folder)
    {
        return $folder->notes()->get();
    }

}
