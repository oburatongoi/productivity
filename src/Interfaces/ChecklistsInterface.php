<?php
namespace Oburatongoi\Productivity\Interfaces;

use App\User;
use Illuminate\Http\Request;
use Oburatongoi\Productivity\Folder;
use Oburatongoi\Productivity\Checklist;

interface ChecklistsInterface
{
    public function forUser(User $user);

    public function rootForUser(User $user);

    public function forFolder(User $user, Folder $folder);

    public function setItemSortOrder(Request $request, Checklist $checklist);

}
