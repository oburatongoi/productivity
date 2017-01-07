<?php

namespace Oburatongoi\Productivity\Policies;

use Oburatongoi\Productivity\User;
use Oburatongoi\Productivity\Note;
use Illuminate\Auth\Access\HandlesAuthorization;

class NotePolicy
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
     * Determine if the given user can view the given note.
     *
     * @param  User  $user
     * @param  Note  $note
     * @return bool
     */
    public function view(User $user, Note $note)
    {

      return $user->id === $note->user_id;

    }

    /**
     * Determine if the given user can modify the given note.
     *
     * @param  User  $user
     * @param  Note  $note
     * @return bool
     */
    public function modify(User $user, Note $note)
    {

      return $user->id === $note->user_id;

    }
}
