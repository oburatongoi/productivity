<?php

namespace Oburatongoi\Productivity\Http\Controllers;

use Illuminate\Http\Request;
use Oburatongoi\Productivity\Http\Controllers\ProductivityBaseController as Controller;
use Oburatongoi\Productivity\Folder;
use Oburatongoi\Productivity\Checklist;

class SearchController extends Controller
{

    public function __construct()
    {
        $this->middleware('web');
    }

    public function search($account, Request $request)
    {
        // $folders = Folder::search($request->input('query'))->get();
        // $checklists = Checklist::search($request->input('query'))->get();
        //
        // if($folders) $folders = $folders->where('user_id', $request->user()->id)->all();
        // if($checklists) $checklists = $checklists->where('user_id', $request->user()->id)->all();

        $folders = Folder::search($request->input('query'))->get();
        $checklists = Checklist::search($request->input('query'))->get();

        $folders = $folders ? $folders->where('user_id', $request->user()->id)->all() : null;
        $checklists = $checklists ? $checklists->where('user_id', $request->user()->id)->all() : null;

        $results = [
            'folders' => $folders,
            'checklists' => $checklists
        ];

        return response()->json([
            'results' => $results
        ]);
    }
}
