<?php

namespace Oburatongoi\Productivity\Repositories\Decorators;


use App\User;
use Oburatongoi\Productivity\Folder;
use Oburatongoi\Productivity\Checklist;
use Oburatongoi\Productivity\Repositories\Checklists;
use Oburatongoi\Productivity\Interfaces\ChecklistsInterface;

// use Illuminate\Support\Facades\Cache;

class CacheableChecklists implements ChecklistsInterface {

    protected $checklists;

    public function __construct(Checklists $checklists)
    {
        $this->checklists = $checklists;
    }

    public function forUser(User $user)
    {
        // return Cache::remember('user.'.$user->id.'.allChecklists', 60 * 60, function() use ($user) {
            return $this->checklists->forUser($user);
        // });
    }

    public function rootForUser(User $user)
    {
        // return Cache::remember('user.'.$user->id.'.rootChecklists', 60 * 60, function() use ($user) {
            return $this->checklists->rootForUser($user);
        // });
    }

    public function forFolder(User $user, Folder $folder)
    {
        // return Cache::remember('user.'.$user->id.'.folder.'.$folder->id.'.checklists', 60 * 60, function() use ($user, $folder) {
            return $this->checklists->forFolder($user, $folder);
        // });
    }

}
