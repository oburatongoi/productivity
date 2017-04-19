<?php
namespace Oburatongoi\Productivity\Interfaces;

use App\User;
use Oburatongoi\Productivity\Folder;

interface ChecklistsInterface
{
    public function forUser(User $user);

    public function rootForUser(User $user);

    public function forFolder(User $user, Folder $folder);

}
