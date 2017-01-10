<?php

namespace Oburatongoi\Productivity\Repositories;

use App\User as AppUser;
use Oburatongoi\Productivity\User as ProductivityUser;
use Oburatongoi\Productivity\Folder;

class ChecklistRepository {

    public function forUser(AppUser $user)
    {
        $user = ProductivityUser::find($user->id);
        
        return $user->checklists()->get();
    }

    public function forFolder(Folder $folder)
    {
        return $folder->checklists()->get();
    }

}
