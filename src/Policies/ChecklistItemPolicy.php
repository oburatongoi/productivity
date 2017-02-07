<?php

namespace Oburatongoi\Productivity\Policies;

use App\User;
use Oburatongoi\Productivity\Checklist;
use Illuminate\Auth\Access\HandlesAuthorization;

class ChecklistItemPolicy
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
}
