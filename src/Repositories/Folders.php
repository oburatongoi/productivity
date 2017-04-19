<?php

namespace Oburatongoi\Productivity\Repositories;

use App\User;
use Oburatongoi\Productivity\Folder;
use Oburatongoi\Productivity\Interfaces\FoldersInterface;

class Folders implements FoldersInterface {

    public function forUser(User $user)
    {
        return $user->folders()->with('checklists', 'subfolders')->orderBy('name', 'asc')->get();
    }

    public function rootForUser(User $user)
    {
        return $user->folders()
                    ->whereNull('folder_id')
                    ->orderBy('name', 'desc')
                    ->get();

        // $unsorted = $user->folders()->whereNull('folder_id')->get();  //dd($unsorted);
        // $sorted = collect($unsorted)->map(function($id) {
        //     return Folder::find($id)->attributesToArray();
        // });   dd($sorted->sortBy('name')->all());
        // return $sorted->sortByDesc('created_at')->all();
    }

    public function rootForFolder(User $user, Folder $folder)
    {
        return $folder->subfolders()
                    ->orderBy('name', 'desc')
                    ->get();
    }

    public function missingFakeId()
    {
        return Folder::whereNull('fake_id')->get();
    }

}
