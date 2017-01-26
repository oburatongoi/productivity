<?php

namespace Oburatongoi\Productivity\Policies;

use App\User;
use Oburatongoi\Productivity\Goal;
use Illuminate\Auth\Access\HandlesAuthorization;

class GoalPolicy
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
     * Determine if the given user can view the given goal.
     *
     * @param  User  $user
     * @param  Goal  $goal
     * @return bool
     */
    public function view(User $user, Goal $goal)
    {

      return $user->id === $goal->user_id;

    }

    /**
     * Determine if the given user can modify the given goal.
     *
     * @param  User  $user
     * @param  Goal  $goal
     * @return bool
     */
    public function modify(User $user, Goal $goal)
    {

      return $user->id === $goal->user_id;

    }
}
