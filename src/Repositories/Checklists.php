<?php

namespace Oburatongoi\Productivity\Repositories;


use App\User;
use Oburatongoi\Productivity\Folder;
use Oburatongoi\Productivity\Checklist;
use Oburatongoi\Productivity\Interfaces\ChecklistsInterface;

class Checklists implements ChecklistsInterface {

    public function forUser(User $user)
    {
        return $user->checklists()->withCount(['items' => function($query) {
            $query->where('checked_at', null);
        }])->orderBy('title', 'asc')->get();
    }

    public function rootForUser(User $user)
    {
        return $user->checklists()->whereNull('folder_id')->withCount(['items' => function($query) {
            $query->where('checked_at', null);
        }])->orderBy('title', 'asc')->get();
    }

    public function forFolder(User $user, Folder $folder)
    {
        return $folder->checklists()->withCount(['items' => function($query) {
            $query->where('checked_at', null);
        }])->orderBy('title', 'asc')->get();
    }

    public function missingFakeId()
    {
        return Checklist::whereNull('fake_id')->get();
    }

}
