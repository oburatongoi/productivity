<?php

namespace Oburatongoi\Productivity\Repositories;

use Oburatongoi\Productivity\User;

class FolderRepository {

    public function forUser(User $user)
    {
        return $user->folders()->with('checklists', 'goals', 'notes', 'subfolders')->get();
    }

}
