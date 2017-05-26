<?php

namespace Oburatongoi\Productivity\Repositories;

use App\User;
use Oburatongoi\Productivity\Checklist;
use Oburatongoi\Productivity\Interfaces\ChecklistItemsInterface;

class ChecklistItems implements ChecklistItemsInterface {

    public function forUser(User $user)
    {
        return $user->items()->get();
    }

    public function pendingForUser(User $user)
    {
        return $user->items()->where([['checked_at', null], ['list_type', 'ta']])->get();
    }

    public function forChecklist(Checklist $checklist)
    {
        return $checklist->items()->get();
    }

}
