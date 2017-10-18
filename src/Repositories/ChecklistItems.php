<?php

namespace Oburatongoi\Productivity\Repositories;

use App\User;
use Oburatongoi\Productivity\Folder;
use Oburatongoi\Productivity\Checklist;
use Oburatongoi\Productivity\ChecklistItem;
use Oburatongoi\Productivity\Interfaces\ChecklistItemsInterface;

// use DB;
// use Crypt;

class ChecklistItems implements ChecklistItemsInterface {

    public function forUser(User $user)
    {
        return $user->items()->get();
    }

    public function pendingForUser(User $user)
    {
        // return $user->items()->where([
        //     ['checked_at', null],
        //     ['list_type', 'ta']
        // ])->with('checklist.folder')->get();

        return $user->items()
            ->whereNull('checked_at')
            ->with('checklist.folder')
            ->whereHas('checklist', function($query) {
                $query->where('list_type', 'ta');
            })
            ->get();

    }

    public function pendingForFolder(Folder $folder)
    {
        return $folder->items()
            ->whereNull('checked_at')
            ->with('checklist.folder')
            ->whereHas('checklist', function($query) {
                $query->where('list_type', 'ta');
            })
            ->get();

    }

    public function forChecklist(Checklist $checklist)
    {
        return $checklist->items()->get();
    }

}
