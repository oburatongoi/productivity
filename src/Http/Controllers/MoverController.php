<?php

namespace Oburatongoi\Productivity\Http\Controllers;

use Illuminate\Http\Request;

use Oburatongoi\Productivity\Http\Controllers\ProductivityBaseController as Controller;

use Oburatongoi\Productivity\Folder;
use Oburatongoi\Productivity\Checklist;
use Oburatongoi\Productivity\ChecklistItem;
use AlgoliaSearch\AlgoliaException as AlgoliaException;

// use Illuminate\Support\Facades\Cache;

use JavaScript, Bugsnag;

class MoverController extends Controller
{
    public function __construct() {
        $this->middleware('web');
        $this->middleware('auth');
    }

    public function fetchInitialTree($account, Request $request)
    {

      try {

        $folders = Folder::select('name', 'fake_id', 'id')
                    ->where('folder_id', $request->input('folder_id'))
                    ->orderBy('name', 'asc')
                    ->with('folder')
                    ->get();

        if ($request->has('includeChecklists')) {
          $checklists = Checklist::select('title', 'fake_id', 'id')
                      ->where('folder_id', $request->input('folder_id'))
                      ->orderBy('title', 'asc')
                      // ->with('folder')
                      ->get();

          return response()->json([
              'folders' => $folders,
              'checklists' => $checklists
          ]);

        } else {

          return response()->json([
              'folders' => $folders
          ]);

        }

      } catch (Exception $e) {

        $this->handleException($e);

      }

    }

    public function fetchNewTree($account, Request $request, Folder $folder)
    {

      try {

        if ($request->has('includeChecklists')) {

          $folder->load('folder', 'subfolders', 'checklists');

        } else {

          $folder->load('folder', 'subfolders');

        }

        return response()->json([
            'folder' => $folder
        ]);

      } catch (Exception $e) {

        $this->handleException($e);

      }

    }

    public function moveToFolder($account, Request $request, Folder $folder)
    {

      try {

        switch ($request->input('child.model')) {
            case 'folder':
                $child = Folder::where('fake_id', $request->input('child.id'))->first();
                break;
            case 'checklist':
                $child = Checklist::where('fake_id', $request->input('child.id'))->first();
                break;
        }

        $child->moveToFolder($folder);

        return response()->json([
            'folder' => $folder,
            'child' => $child
        ]);

      } catch (Exception $e) {

        Bugsnag::notifyException($e);
        $this->handleException($e);

      }

    }

    public function moveToChecklist($account, Request $request, Checklist $checklist, ChecklistItem $item)
    {

      try {

        $item->moveToChecklist($checklist);

        return response()->json([
            'checklist' => $checklist,
            'child' => $item
        ]);

      } catch (Exception $e) {

        $this->handleException($e);

      }

    }

    public function moveToHome($account, Request $request)
    {

        try {

          switch ($request->input('child.model')) {
              case 'folder':
                  $child = Folder::where('fake_id', $request->input('child.id'))->first();
                  break;
              case 'checklist':
                  $child = \Oburatongoi\Productivity\Checklist::where('fake_id', $request->input('child.id'))->first();
                  break;
          }

          $child->moveToHome();

          return response()->json([
              'child' => $child
          ]);

        } catch (Exception $e) {

          $this->handleException($e);

        }

    }

    public function fixTree()
    {
        try {

          $tree = Folder::fixTree();

          return response()->json([
              'fixed' => $tree
          ]);

        } catch (Exception $e) {

          $this->handleException($e);

        }

    }
}
