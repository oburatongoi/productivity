<?php

namespace Oburatongoi\Productivity\Repositories;

use App\User as AppUser;
use Oburatongoi\Productivity\User as ProductivityUser;

class FolderRepository {

    public function forUser(AppUser $user)
    {
        $user = ProductivityUser::find($user->id);

        return $user->folders()->with('checklists', 'goals', 'notes', 'subfolders')->get();
    }

}
