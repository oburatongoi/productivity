<?php

namespace Oburatongoi\Productivity\Http\Controllers;

use Illuminate\Http\Request;

use Oburatongoi\Productivity\Http\Controllers\ProductivityBaseController as Controller;

use Oburatongoi\Productivity\Folder;
use Oburatongoi\Productivity\Checklist;
use Oburatongoi\Productivity\ChecklistItem;
use AlgoliaSearch\AlgoliaException as AlgoliaException;

// use Illuminate\Support\Facades\Cache;

use JavaScript, Bugsnag, Exception;

class SelectionController extends Controller
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
      $success = false;

      $selected = [];

      $folders = $request->has('selected.folders') ? $request->input('selected.folders') : [];
      $checklists = $request->has('selected.checklists') ? $request->input('selected.checklists') : [];

      foreach ($folders as $selectedFolder) {
        $child = Folder::where('fake_id', $selectedFolder['fake_id'])->first();

        try {
          if($child) $child->moveToFolder($folder);
          $success = true;
        } catch (AlgoliaException $e) {
          // WIP: Add to some sort of queue to sync to algolia
          Bugsnag::notifyException($e);
          $success = true;
        } catch (Exception $e) {
          Bugsnag::notifyException($e);
          $this->handleException($e);
        }

        $selected['folders'][] = $child;
      }

      foreach ($checklists as $selectedChecklist) {
        $child = Checklist::where('fake_id', $selectedChecklist['fake_id'])->first();

        try {
          if($child) $child->moveToFolder($folder);
          $success = true;
        } catch (AlgoliaException $e) {
          // WIP: Add to some sort of queue to sync to algolia
          Bugsnag::notifyException($e);
          $success = true;
        } catch (Exception $e) {
          Bugsnag::notifyException($e);
          $this->handleException($e);
        }

        $selected['checklists'][] = $child;
      }

      return response()->json([
          'success' => $success,
          'selected' => $selected
      ]);

    }

    public function moveToChecklist($account, Request $request, Checklist $checklist)
    {

      $this->authorize('modify', $checklist);

      $success = false;

      $selected = [];

      $checklistItems = $request->has('selected.checklistItems') ? $request->input('selected.checklistItems') : [];

      foreach ($checklistItems as $item) {
        $child = ChecklistItem::where('id', $item['id'])->first();

        $this->authorize('modify', $child);

        try {
          if($child) $child->moveToChecklist($checklist);
          $success = true;
        } catch (AlgoliaException $e) {
          // WIP: Add to some sort of queue to sync to algolia
          Bugsnag::notifyException($e);
          $success = true;
        } catch (Exception $e) {
          Bugsnag::notifyException($e);
          $this->handleException($e);
        }

        $selected['checklistItems'][] = [
          'old' => $item,
          'new' => $child
        ];
      }

      return response()->json([
          'success' => $success,
          'checklist' => $checklist,
          'selected' => $selected
      ]);

    }

    public function moveToHome($account, Request $request)
    {
        $success = false;

        $selected = [];

        $folders = $request->has('selected.folders') ? $request->input('selected.folders') : [];
        $checklists = $request->has('selected.checklists') ? $request->input('selected.checklists') : [];

        foreach ($folders as $selectedFolder) {
          $child = Folder::where('fake_id', $selectedFolder['fake_id'])->first();

          try {
            if($child) $child->moveToHome();
            $success = true;
          } catch (AlgoliaException $e) {
            // WIP: Add to some sort of queue to sync to algolia
            Bugsnag::notifyException($e);
            $success = true;
          } catch (Exception $e) {
            Bugsnag::notifyException($e);
            $this->handleException($e);
          }

          $selected['folders'][] = $child;
        }

        foreach ($checklists as $selectedChecklist) {
          $child = Checklist::where('fake_id', $selectedChecklist['fake_id'])->first();

          try {
            if($child) $child->moveToHome();
            $success = true;
          } catch (AlgoliaException $e) {
            // WIP: Add to some sort of queue to sync to algolia
            Bugsnag::notifyException($e);
            $success = true;
          } catch (Exception $e) {
            Bugsnag::notifyException($e);
            $this->handleException($e);
          }

          $selected['checklists'][] = $child;
        }

        return response()->json([
            'success' => $success,
            'selected' => $selected
        ]);

    }

    public function delete($account, Request $request)
    {
        $success = false;

        $selected = [];

        $folders = $request->has('selected.folders') ? $request->input('selected.folders') : [];
        $checklists = $request->has('selected.checklists') ? $request->input('selected.checklists') : [];
        $checklistItems = $request->has('selected.checklistItems') ? $request->input('selected.checklistItems') : [];

        foreach ($folders as $selectedFolder) {
          $child = Folder::where('fake_id', $selectedFolder['fake_id'])->first();

          $this->authorize('modify', $child);

          try {
            if($child) $child->delete();
            $success = true;
          } catch (AlgoliaException $e) {
            // WIP: Add to some sort of queue to sync to algolia
            Bugsnag::notifyException($e);
            $success = true;
          } catch (Exception $e) {
            Bugsnag::notifyException($e);
            $this->handleException($e);
          } catch (\ModelNotFoundException $e) {
            $this->handleException($e);
          } catch (\NotFoundHttpException $e) {
            $this->handleException($e);
          }

          $selected['folders'][] = $child;
        }

        foreach ($checklists as $selectedChecklist) {
          $child = Checklist::where('fake_id', $selectedChecklist['fake_id'])->first();

          $this->authorize('modify', $child);

          try {
            if($child) $child->delete();
            $success = true;
          } catch (AlgoliaException $e) {
            // WIP: Add to some sort of queue to sync to algolia
            Bugsnag::notifyException($e);
            $success = true;
          } catch (Exception $e) {
            Bugsnag::notifyException($e);
            $this->handleException($e);
          } catch (\ModelNotFoundException $e) {
            $this->handleException($e);
          } catch (\NotFoundHttpException $e) {
            $this->handleException($e);
          }

          $selected['checklists'][] = $child;
        }

        foreach ($checklistItems as $item) {
          $child = ChecklistItem::where('id', $item['id'])->first();

          $this->authorize('modify', $child);

          try {
            if($child) $child->delete();
            $success = true;
          } catch (AlgoliaException $e) {
            // WIP: Add to some sort of queue to sync to algolia
            Bugsnag::notifyException($e);
            $success = true;
          } catch (Exception $e) {
            Bugsnag::notifyException($e);
            $this->handleException($e);
          } catch (\ModelNotFoundException $e) {
            $this->handleException($e);
          } catch (\NotFoundHttpException $e) {
            $this->handleException($e);
          }

          $selected['checklistItems'][] = $child;
        }

        return response()->json([
            'success' => $success,
            'selected' => $selected
        ]);

    }

    public function fixTree()
    {
        try {

          $tree = Folder::fixTree();

          return response()->json([
              'fixed' => $tree
          ]);

        } catch (AlgoliaException $e) {
          // WIP: Add to some sort of queue to sync to algolia
          Folder::withoutSyncingToSearch(function () {
              $tree = Folder::fixTree();
          });

          return response()->json([
              'fixed' => $tree
          ]);
        } catch (Exception $e) {

          // $this->handleException($e);

          return response()->json([
              'exception' => $e->getMessage()
          ]);

        }

    }
}
