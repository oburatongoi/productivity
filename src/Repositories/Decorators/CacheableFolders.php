<?php

namespace Oburatongoi\Productivity\Repositories\Decorators;

use App\User;
use Oburatongoi\Productivity\Folder;
use Oburatongoi\Productivity\Repositories\Folders;
use Oburatongoi\Productivity\Interfaces\FoldersInterface;

// use Illuminate\Support\Facades\Cache;

class CacheableFolders implements FoldersInterface {

    protected $folders;

    public function __construct(Folders $folders)
    {
        $this->folders = $folders;
    }

    public function forUser(User $user)
    {
        // return Cache::remember('user.'.$user->id.'.allFolders', 60 * 60, function() use ($user) {
            return $this->folders->forUser($user);
        // });
    }

    public function rootForUser(User $user)
    {
        // return Cache::remember('user.'.$user->id.'.rootFolders', 60 * 60, function() use ($user) {
            return $this->folders->rootForUser($user);
        // });
    }

    public function rootForFolder(User $user, Folder $folder)
    {
        // return Cache::remember('user.'.$user->id.'.folder.'.$folder->id.'.subFolders', 60 * 60, function() use ($user, $folder) {
            return $this->folders->rootForFolder($user, $folder);
        // });
    }

}
