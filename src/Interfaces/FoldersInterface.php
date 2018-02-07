<?php
namespace Oburatongoi\Productivity\Interfaces;

use App\User;
use Oburatongoi\Productivity\Folder;

interface FoldersInterface
{
    public function forUser(User $user);

    public function rootForUser(User $user);

    public function rootForFolder(User $user, Folder $folder);

    public function getKanbanDescendants($nestedKanban);

}
