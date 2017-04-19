<?php

namespace Oburatongoi\Productivity\Repositories\Decorators;

use Oburatongoi\Productivity\Checklist;
use Oburatongoi\Productivity\ChecklistItem;

class CacheableChecklistItems {

    protected $checklist_items;

    public function __construct($checklist_items)
    {
        $this->checklist_items = $checklist_items;
    }

    public function forChecklist(Checklist $checklist)
    {
        return $this->checklist_items()->forChecklist($checklist);
    }

}
