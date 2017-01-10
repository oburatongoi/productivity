<?php

namespace Oburatongoi\Productivity\Repositories;

use App\User as AppUser;
use Oburatongoi\Productivity\User as ProductivityUser;
use Oburatongoi\Productivity\Folder;

class NoteRepository {

    public function forUser(AppUser $user)
    {
        $user = ProductivityUser::find($user->id);

        return $user->notes()->get();
    }

    public function forFolder(Folder $folder)
    {
        return $folder->notes()->get();
    }

}
