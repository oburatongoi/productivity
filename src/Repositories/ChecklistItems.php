<?php

namespace Oburatongoi\Productivity\Repositories;

use App\User;
use Illuminate\Http\Request;
use Oburatongoi\Productivity\Folder;
use Oburatongoi\Productivity\Checklist;
use Oburatongoi\Productivity\ChecklistItem;
use Oburatongoi\Productivity\Interfaces\ChecklistItemsInterface;

use DB;

class ChecklistItems implements ChecklistItemsInterface {

    public function forUser(User $user)
    {
        return $user->items()->get();
    }

    public function pendingForUser(User $user)
    {
        return $user->items()
            ->whereNull('checked_at')
            ->with('checklist.folder', 'children')
            ->whereHas('checklist', function($query) {
                $query->where('list_type', 'ta');
            })
            ->get();

    }

    public function pendingForFolder(Folder $folder)
    {
        return $folder->items()
            ->whereNull('checked_at')
            ->with('checklist.folder')
            ->whereHas('checklist', function($query) {
                $query->where('list_type', 'ta');
            })
            ->get();

    }

    public function forChecklist(Checklist $checklist)
    {
        return $checklist->items()->orderBy('sort_order', 'asc')->get();
    }

    public static function setItemSortOrder(Request $request, ChecklistItem $parentItem)
    {
      $response = [];

      // If a list of checklist items is included, use these to maintain proper ordering with the front end
      if($request->checklistItems) {
        foreach ($request->checklistItems as $key => $item) {
          $item = ChecklistItem::find($item['id']);
          try {
            if (empty($item->sort_order) || $item->sort_order !== $key) {
              $updated = $item->update([ 'sort_order' => $key ]);
            }
          } catch (AlgoliaException $e) {
            $response['exceptions'][] = $e->getMessage();
          } catch (Exception $e) {
            $response['exceptions'][] = $e->getMessage();
          }

          if(isset($updated)) $response['items'][] = $item;

        }

        return response()->json($response);
      }

      // If the request does not contain a list of checklistItems, fetch them from the database

      try {
        $items = DB::table('productivity_checklist_items')
                 ->whereNull('checklist_id')
                 ->where('parent_id', $parentItem->id)
                 ->orderBy('sort_order')
                 ->latest()
                 ->get();
        if($items) {
          foreach ($items as $key => $item) {

            try {
               $updated = DB::table('productivity_checklist_items')
                            ->where([
                              ['id', $item->id],
                              ['parent_id', $parentItem->id]
                            ])
                            ->update([ 'sort_order' => $key ]);
               if($updated) $response['items'][] = $item->id;
            } catch (AlgoliaException $e) {
              $response['exceptions'][] = $e;
            } catch (Exception $e) {
              $response['exceptions'][] = $e;
            }

          }
        } else {
         $response['exceptions'][] = 'No checklist items were found in the database.';
        }

      } catch (Exception $e) {
        $response['exceptions'][] = $e;
      }

      return $response;
    }

}
