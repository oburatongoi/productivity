<?php

namespace Oburatongoi\Productivity\Repositories\Decorators;

use App\User;
use Oburatongoi\Productivity\Folder;
use Oburatongoi\Productivity\Checklist;
use Oburatongoi\Productivity\ChecklistItem;
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

    public function pendingForFolder(Folder $folder)
    {
        return $this->items->pendingForFolder($folder);
    }

    public function forChecklist(Checklist $checklist)
    {
        return $this->items->forChecklist($checklist);
    }

    public function getKanbanDescendants($nestedKanban)
    {
      // return Cache::remember('checklist.'.$nestedKanban->id.'.kanbanDescendants', 60 * 60, function() use ($nestedKanban) {
          return $this->items->getKanbanDescendants($nestedKanban);
      // });
    }

}
