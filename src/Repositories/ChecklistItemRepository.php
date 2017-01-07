<?php

namespace Oburatongoi\Productivity\Repositories;

use Oburatongoi\Productivity\Checklist;

class ChecklistItemRepository {

    public function forChecklist(Checklist $checklist)
    {
        return $checklist->list_items()->get();
    }

}
