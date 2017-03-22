<?php

namespace Oburatongoi\Productivity\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Oburatongoi\Productivity\Folder;
use Oburatongoi\Productivity\Checklist;

class SearchController extends Controller
{
    public function search(Request $request)
    {
        if ($request->currentFolderId) {
            $folders = Folder::search($request->input('query'))
                                ->where('folder_id', $request->currentFolderId)
                                ->get();
            $checklists = Checklist::search($request->input('query'))
                                    ->where('folder_id', $request->currentFolderId)
                                    ->get();
        } else {
            $folders = Folder::search($request->input('query'))
                                ->get();
            $checklists = Checklist::search($request->input('query'))
                                ->get();
        }

        $results = [
            'folders' => $folders,
            'checklists' => $checklists
        ];

        return response()->json([
            'results' => $results
        ]);
    }
}
