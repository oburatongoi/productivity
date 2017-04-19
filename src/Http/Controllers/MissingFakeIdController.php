<?php

namespace Oburatongoi\Productivity\Http\Controllers;

use Illuminate\Http\Request;
use Oburatongoi\Productivity\Http\Controllers\ProductivityBaseController as Controller;
use Oburatongoi\Productivity\Repositories\Checklists;
use Oburatongoi\Productivity\Repositories\Folders;


class MissingFakeIdController extends Controller
{

    protected $checklists;
    protected $folders;

    public function __construct(Checklists $checklists, Folders $folders)
    {
        $this->middleware('web');
        $this->middleware('auth');

        $this->checklists = $checklists;
        $this->folders = $folders;
    }

    public function addMissingFakeIds()
    {
        $checklists = $this->checklists->missingFakeId();
        $folders = $this->folders->missingFakeId();

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

}
