<?php

namespace Oburatongoi\Productivity\Policies;

use Oburatongoi\Productivity\User;
use Oburatongoi\Productivity\Folder;
use Illuminate\Auth\Access\HandlesAuthorization;

class FolderPolicy
{
    use HandlesAuthorization;

    /**
     * Create a new policy instance.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    /**
     * Determine if the given user can view the given folder.
     *
     * @param  User  $user
     * @param  Folder  $folder
     * @return bool
     */
    public function view(User $user, Folder $folder)
    {

      return $user->id === $folder->user_id;

    }

    /**
     * Determine if the given user can modify the given folder.
     *
     * @param  User  $user
     * @param  Folder  $folder
     * @return bool
     */
    public function modify(User $user, Folder $folder)
    {

      return $user->id === $folder->user_id;

    }
}
