<?php

namespace Oburatongoi\Productivity\Repositories;

use Oburatongoi\Productivity\User;
use Oburatongoi\Productivity\Folder;

class ChecklistRepository {

    public function forUser(User $user)
    {
        return $user->checklists()->get();
    }

    public function forFolder(Folder $folder)
    {
        return $folder->checklists()->get();
    }

}
