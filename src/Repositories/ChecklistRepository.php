<?php

namespace Oburatongoi\Productivity\Repositories;


use App\User;
use Oburatongoi\Productivity\Folder;
use Oburatongoi\Productivity\Checklist;

class ChecklistRepository {

    public function forUser(User $user)
    {
        return $user->checklists()->orderBy('created_at', 'asc')->withCount(['items' => function($query) {
            $query->where('checked_at', null);
        }])->get();
    }

    public function rootForUser(User $user)
    {
        return $user->checklists()->whereNull('folder_id')->orderBy('created_at', 'asc')->withCount(['items' => function($query) {
            $query->where('checked_at', null);
        }])->get();
    }

    public function forFolder(Folder $folder)
    {
        return $folder->checklists()->orderBy('created_at', 'asc')->withCount(['items' => function($query) {
            $query->where('checked_at', null);
        }])->get();
    }

    public function missingFakeId()
    {
        return Checklist::whereNull('fake_id')->get();
    }

}
