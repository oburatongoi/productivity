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
      $results = [];

      $folders = Folder::search($request->input('query'))->get();
      $checklists = Checklist::search($request->input('query'))->get();


      $results['folders'] = $folders ? $folders->where('user_id', $request->user()->id)->all() : null;
      $results['checklists'] = $checklists ? $checklists->where('user_id', $request->user()->id)->all() : null;


      // dd($results);

      return response()->json([
          'results' => $results
      ]);
  }
}
