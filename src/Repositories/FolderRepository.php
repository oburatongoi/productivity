<?php

namespace Oburatongoi\Productivity\Repositories;

use App\User;

class FolderRepository {

    public function forUser(User $user)
    {
        return $user->folders()->with('checklists', 'goals', 'notes', 'subfolders')->orderBy('updated_at', 'desc')->get();
    }

    public function rootForUser(User $user)
    {
        return $user->folders()
                    ->whereNull('parent_id')
                    ->orderBy('updated_at', 'desc')
                    ->get();
    }

}
