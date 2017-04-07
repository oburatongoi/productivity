<?php

namespace Oburatongoi\Productivity\Http\Controllers;

use Illuminate\Http\Request;
use Oburatongoi\Productivity\Http\Controllers\ProductivityBaseController as Controller;
use Oburatongoi\Productivity\Folder;
use Oburatongoi\Productivity\Checklist;

class SearchController extends Controller
{
    public function search($account, Request $request)
    {
        // if ($request->currentFolderId) {
        //     $folders = Folder::search($request->input('query'))
        //                         ->where('folder_id', $request->currentFolderId)
        //                         ->get();
        //     $checklists = Checklist::search($request->input('query'))
        //                             ->where('folder_id', $request->currentFolderId)
        //                             ->get();
        // } else {
        //     $folders = Folder::search($request->input('query'))
        //                         ->get();
        //     $checklists = Checklist::search($request->input('query'))
        //                         ->get();
        // }

        $folders = Folder::search($request->input('query'))
                            ->get();
        $checklists = Checklist::search($request->input('query'))
                            ->get();

        $results = [
            'folders' => $folders,
            'checklists' => $checklists
        ];

        return response()->json([
            'results' => $results
        ]);
    }
}
