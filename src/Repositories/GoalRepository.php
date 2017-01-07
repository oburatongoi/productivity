<?php

namespace Oburatongoi\Productivity\Repositories;

use Oburatongoi\Productivity\User;
use Oburatongoi\Productivity\Folder;

class GoalRepository {

    public function forUser(User $user)
    {
        return $user->goal()->get();
    }

    public function forFolder(Folder $folder)
    {
        return $folder->goal()->get();
    }

}
