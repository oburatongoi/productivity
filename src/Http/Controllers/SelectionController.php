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
                    ->where([
                      ['parent_id', $request->input('folder_id')],
                      ['user_id', $request->user()->id],
                    ])
                    ->orderBy('name', 'asc')
                    ->with('folder')
                    ->get();

        if ($request->has('includeChecklists')) {
          $checklists = Checklist::select('title', 'fake_id', 'id', 'folder_id')
                      ->where([
                        ['folder_id', $request->input('folder_id')],
                        ['user_id', $request->user()->id],
                      ])
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
        $relations = ['folder', 'children'];

        if ($request->has('includeChecklists')) $relations[] = 'checklists';

        $folder->load($relations);

        return response()->json([
            'folder' => $folder
        ]);

      } catch (Exception $e) {
        $this->handleException($e);
      }

    }

    public function fetchListItems($account, Request $request, Checklist $checklist)
    {

      try {
        $relations = ['items'];

        $checklist->load($relations);

        return response()->json([
            'checklist' => $checklist
        ]);

      } catch (Exception $e) {
        $this->handleException($e);
      }

    }

    public function fetchChildListItems($account, Request $request, ChecklistItem $item)
    {

      try {
        $relations = ['checklist', 'children'];

        $item->load($relations);

        return response()->json([
            'item' => $item
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
        try {
          if($child = Folder::where('fake_id', $selectedFolder['fake_id'])->first())
            if($success = $child->moveToFolder($folder))
              $selected['folders'][] = $child;
        } catch (AlgoliaException $e) {
          // WIP: Add to some sort of queue to sync to algolia
          Bugsnag::notifyException($e);
          $success = true;
        } catch (Exception $e) {
          Bugsnag::notifyException($e);
          $this->handleException($e);
        }
      }

      foreach ($checklists as $selectedChecklist) {
        try {
          if($child = Checklist::where('fake_id', $selectedChecklist['fake_id'])->first())
            if($success = $child->moveToFolder($folder))
              $selected['checklists'][] = $child;
        } catch (AlgoliaException $e) {
          // WIP: Add to some sort of queue to sync to algolia
          Bugsnag::notifyException($e);
          $success = true;
        } catch (Exception $e) {
          Bugsnag::notifyException($e);
          $this->handleException($e);
        }
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
        try {
          if($child = ChecklistItem::where('id', $item['id'])->first())
            if($success = $child->moveToChecklist($checklist))
              $selected['checklistItems'][] = [
                'old' => $item,
                'new' => $child
              ];
        } catch (AlgoliaException $e) {
          // WIP: Add to some sort of queue to sync to algolia
          Bugsnag::notifyException($e);
          $success = true;
        } catch (Exception $e) {
          Bugsnag::notifyException($e);
          $this->handleException($e);
        }
      }

      return response()->json([
          'success' => $success,
          'list_type' => $checklist->list_type,
          'selected' => $selected
      ]);

    }

    public function moveToChecklistItem($account, Request $request, ChecklistItem $checklistItem)
    {

      $this->authorize('modify', $checklistItem);

      $success = false;

      $selected = [];

      $checklistItems = $request->has('selected.checklistItems') ? $request->input('selected.checklistItems') : [];

      foreach ($checklistItems as $item) {
        try {
          if($child = ChecklistItem::where('id', $item['id'])->first())
           if($success = $child->moveToChecklistItem($checklistItem))
              $selected['checklistItems'][] = [
                 'old' => $item,
                 'new' => $child
               ];
        } catch (AlgoliaException $e) {
          // WIP: Add to some sort of queue to sync to algolia
          Bugsnag::notifyException($e);
          $success = true;
        } catch (Exception $e) {
          Bugsnag::notifyException($e);
          $this->handleException($e);
        }
      }

      return response()->json([
          'success' => $success,
          'list_type' => $checklistItem->sub_list_type,
          'selected' => $selected,
          'switchParent' => true
        ]);

    }

    public function moveToHome($account, Request $request)
    {
        $success = false;

        $selected = [];

        $folders = $request->has('selected.folders') ? $request->input('selected.folders') : [];
        $checklists = $request->has('selected.checklists') ? $request->input('selected.checklists') : [];

        foreach ($folders as $selectedFolder) {
          try {
            if($child = Folder::where('fake_id', $selectedFolder['fake_id'])->first())
              if($success = $child->moveToHome())
                $selected['folders'][] = $child;
          } catch (AlgoliaException $e) {
            // WIP: Add to some sort of queue to sync to algolia
            Bugsnag::notifyException($e);
            $success = true;
          } catch (Exception $e) {
            Bugsnag::notifyException($e);
            $this->handleException($e);
          }
        }

        foreach ($checklists as $selectedChecklist) {
          try {
            if($child = Checklist::where('fake_id', $selectedChecklist['fake_id'])->first())
              if($success = $child->moveToHome())
                $selected['checklists'][] = $child;
          } catch (AlgoliaException $e) {
            // WIP: Add to some sort of queue to sync to algolia
            Bugsnag::notifyException($e);
            $success = true;
          } catch (Exception $e) {
            Bugsnag::notifyException($e);
            $this->handleException($e);
          }
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

}
