<?php

namespace Oburatongoi\Productivity\Repositories;

use Oburatongoi\Productivity\Checklist;

class ChecklistItems {

    public function forChecklist(Checklist $checklist)
    {
        return $checklist->items()->get();
    }

}
