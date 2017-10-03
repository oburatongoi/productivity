<?php

namespace Oburatongoi\Productivity\Repositories;

use App\User;
use Oburatongoi\Productivity\Folder;
use Oburatongoi\Productivity\Checklist;
use Oburatongoi\Productivity\ChecklistItem;
use Oburatongoi\Productivity\Interfaces\ChecklistItemsInterface;

// use DB;
// use Crypt;

class ChecklistItems implements ChecklistItemsInterface {

    public function forUser(User $user)
    {
        return $user->items()->get();
    }

    public function pendingForUser(User $user)
    {
        return $user->items()->where([
            ['checked_at', null],
            ['list_type', 'ta']
        ])->with('checklist.folder')->get();

        // $q = DB::table('productivity_checklist_items')
        //             ->where([
        //                 ['productivity_checklist_items.deleted_at', null],
        //                 ['productivity_checklist_items.checked_at', null]
        //             ])
        //             ->join('productivity_checklists', function ($join) {
        //                 $join->on('productivity_checklist_items.checklist_id', '=', 'productivity_checklists.id')
        //                     ->where([
        //                         ['productivity_checklists.deleted_at', null],
        //                         ['productivity_checklists.list_type', 'ta']
        //                     ]);
        //             })
        //             ->leftJoin('productivity_folders', function ($join) {
        //                 $join->on('productivity_checklists.folder_id', '=', 'productivity_folders.id')
        //                 ->where('productivity_folders.deleted_at', null);
        //             })
        //             ->select(
        //                 'productivity_checklist_items.*',
        //                 'productivity_checklists.title as checklist_title',
        //                 'productivity_checklists.fake_id as checklist_fake_id',
        //                 'productivity_folders.name as folder_name',
        //                 'productivity_folders.fake_id as folder_fake_id'
        //             )->get();
        //
        //             dd($q);

    }

    public function pendingForFolder(Folder $folder)
    {
        return $folder->items()->where([
            ['checked_at', null]
        ])->with(['checklist' => function($query) {
            $query->where('list_type', 'ta');
        }, 'checklist.folder'])->get();

    }

    public function forChecklist(Checklist $checklist)
    {
        return $checklist->items()->get();
    }

}
