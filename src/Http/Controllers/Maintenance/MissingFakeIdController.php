<?php

namespace Oburatongoi\Productivity\Http\Controllers\Maintenance;

use Illuminate\Http\Request;
use Oburatongoi\Productivity\Http\Controllers\ProductivityBaseController as Controller;
use Oburatongoi\Productivity\Checklist;
use Oburatongoi\Productivity\Folder;



class MissingFakeIdController extends Controller
{
    public function __construct()
    {
        $this->middleware('web');
        $this->middleware('auth');
    }

    public function addMissingFakeIds()
    {
        $checklists = $this->missingFakeId('checklist');
        $folders = $this->missingFakeId('folder');

        if ( $checklists->count() ) {
            foreach ($checklists as $checklist) {
                $checklist->fakeID();
            }
        }

        if ( $folders->count() ) {
            foreach ($checklists as $checklist) {
                $checklist->fakeID();
            }
        }

        if ( $folders->count() || $checklists->count() ) return response()->json([
            'checklists' => $checklists,
            'folders' => $folders
        ]);

        return response()->json([
            'Message' => 'There were no models missing fake_id'
        ]);
    }


    public function missingFakeId($model)
    {
        switch ($model) {
          case 'folder':
            return Folder::whereNull('fake_id')->get();
            break;
          case 'checklist':
            return Checklist::whereNull('fake_id')->get();
            break;
        }

    }

}
