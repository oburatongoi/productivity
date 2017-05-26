<?php
namespace Oburatongoi\Productivity\Interfaces;

use App\User;
use Oburatongoi\Productivity\Checklist;

interface ChecklistItemsInterface
{
    public function forUser(User $user);
    
    public function pendingForUser(User $user);

    public function forChecklist(Checklist $checklist);

}
