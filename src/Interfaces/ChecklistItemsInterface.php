<?php
namespace Oburatongoi\Productivity\Interfaces;

use App\User;
use Oburatongoi\Productivity\Folder;
use Oburatongoi\Productivity\Checklist;

interface ChecklistItemsInterface
{
    public function forUser(User $user);

    public function pendingForUser(User $user);

    public function pendingForFolder(Folder $folder);

    public function forChecklist(Checklist $checklist);

    public function getKanbanDescendants($nestedKanban);

}
