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

  public $relationsToLoad = [
    'checklist.folder',
    'sub_items:id,content,checklist_id,parent_id,checked_at,sub_list_type,sort_order,is_urgent,is_important,deadline'
  ];

    public function forUser(User $user)
    {
        return $user->items()->get();
    }

    public function pendingForUser(User $user)
    {
        return $user->items()
                    ->whereNull('checked_at')
                    ->with($this->relationsToLoad)
                    ->whereHas('checklist', function($query) {
                        $query->where('list_type', 'ta');
                    })
                    ->get();

    }

    public function pendingForFolder(Folder $folder)
    {
        return $folder->items()
                      ->whereNull('checked_at')
                      ->with($this->relationsToLoad)
                      ->whereHas('checklist', function($query) {
                          $query->where('list_type', 'ta');
                      })
                      ->get();

    }

    public function forChecklist(Checklist $checklist)
    {
        return $checklist->items()
                         ->with('sub_items:id,content,checklist_id,parent_id,checked_at,sub_list_type,sort_order,is_urgent,is_important,deadline')
                         ->orderBy('sort_order', 'asc')
                         ->get();
    }

    public static function setItemSortOrder(Request $request, ChecklistItem $parentItem)
    {
      $itemsToUpdate = [];
      $response = [];

      // If a list of checklist items is included, use these to maintain proper ordering with the front end
      if($request->checklistItems) {
        foreach ($request->checklistItems as $key => $item) {
          if (empty($item->sort_order) || $item->sort_order !== $key) {
            $itemsToUpdate[$item['id']] = $key;
          }
        }
      } else { // If the request does not contain a list of checklistItems, fetch them from the database

        try {
          $items = DB::table('productivity_checklist_items')
                     ->whereNull('checklist_id')
                     ->where('parent_id', $parentItem->id)
                     ->orderBy('sort_order')
                     ->latest()
                     ->get();
          if($items) {
            foreach ($items as $key => $item) {
              $itemsToUpdate[$item->id] = $key;
              $response['items'][] = $item->id;
            }
          } else $response['exceptions'][] = 'This list has no checklist items.';

        } catch (Exception $e) {
          $response['exceptions'][] = $e;
        }
      }

      // Generate the update statement
      $ids = [];
      $updateSQLQuery = "UPDATE productivity_checklist_items SET sort_order = CASE id";
      foreach ($itemsToUpdate as $id => $sort_order) {
        $updateSQLQuery .= " WHEN ".$id." THEN ".$sort_order;
        $ids[] = $id;
      }
      $updateSQLQuery .= " END WHERE parent_id = ".$parentItem->id." AND id IN (" . implode(",",$ids) . ");";

      if(isset($itemsToUpdate) && ! empty($itemsToUpdate)) $sorted_count = DB::update( $updateSQLQuery );

      if(isset($sorted_count)) $response['sorted_count'] = $sorted_count;

      if($request->wantsJson()) return response()->json($response);
      else return $response;
    }

    public function getKanbanDescendants($nestedKanban)
    {
      $item = ChecklistItem::where('id', $nestedKanban['id'])
                    ->with('sub_items:id,content,checklist_id,parent_id,checked_at,sub_list_type,sort_order,is_urgent,is_important,deadline')
                    ->first();

      return [
        'sub_items' => $item->sub_items
      ];
    }

}
