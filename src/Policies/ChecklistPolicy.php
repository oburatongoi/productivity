<?php

namespace Oburatongoi\Productivity\Policies;

use App\User;
use Oburatongoi\Productivity\Checklist;
use Illuminate\Auth\Access\HandlesAuthorization;

class ChecklistPolicy
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
     * Determine if the given user can view the given checklist.
     *
     * @param  User  $user
     * @param  Checklist  $checklist
     * @return bool
     */
    public function view(User $user, Checklist $checklist)
    {
      return $user->id === $checklist->user_id;
    }

    /**
     * Determine if the given user can modify the given checklist.
     *
     * @param  User  $user
     * @param  Checklist  $checklist
     * @return bool
     */
    public function modify(User $user, Checklist $checklist)
    {

      return $user->id === $checklist->user_id;

    }

    /**
     * Determine if the given user can admin the given checklist.
     *
     * @param  User  $user
     * @param  Checklist  $checklist
     * @return bool
     */
    public function admin(User $user, Checklist $checklist)
    {

      return $user->id === $checklist->user_id;

    }
}
