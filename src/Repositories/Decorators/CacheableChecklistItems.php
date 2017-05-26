<?php

namespace Oburatongoi\Productivity\Repositories\Decorators;

use App\User;
use Oburatongoi\Productivity\Checklist;
use Oburatongoi\Productivity\Repositories\ChecklistItems;
use Oburatongoi\Productivity\Interfaces\ChecklistItemsInterface;

class CacheableChecklistItems implements ChecklistItemsInterface {

    protected $items;

    public function __construct(ChecklistItems $items)
    {
        $this->items = $items;
    }

    public function forUser(User $user)
    {
        return $this->items->forUser($user);
    }

    public function pendingForUser(User $user)
    {
        return $this->items->pendingForUser($user);
    }

    public function forChecklist(Checklist $checklist)
    {
        return $this->items->forChecklist($checklist);
    }

}
