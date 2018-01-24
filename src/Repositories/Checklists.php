<?php

namespace Oburatongoi\Productivity\Repositories;


use App\User;
use Illuminate\Http\Request;
use Oburatongoi\Productivity\Folder;
use Oburatongoi\Productivity\Checklist;
use Oburatongoi\Productivity\Interfaces\ChecklistsInterface;
use AlgoliaSearch\AlgoliaException;
use DB, Exception;

class Checklists implements ChecklistsInterface {

    public function forUser(User $user)
    {
        return $user->checklists()
                    ->with('sections:id,fake_id,title,parent_id', 'items:id,content,checklist_id', 'sections.items:id,content,checklist_id')
                    ->withCount(['items' => function($query) {
                        $query->where('checked_at', null);
                    }])
                    ->orderBy('title', 'asc')
                    ->get();
    }

    public function rootForUser(User $user)
    {
        return $user->checklists()
                    ->whereNull('folder_id')
                    ->whereNull('parent_id')
                    ->with('sections:id,fake_id,title,parent_id', 'items:id,content,checklist_id', 'sections.items:id,content,checklist_id')
                    ->withCount(['items' => function($query) {
                        $query->where('checked_at', null);
                    }])->orderBy('title', 'asc')
                    ->get();
    }

    public function forFolder(User $user, Folder $folder)
    {
        return $folder->checklists()
                      ->with('sections:id,fake_id,title,parent_id', 'items:id,content,checklist_id', 'sections.items:id,content,checklist_id')
                      ->withCount(['items' => function($query) {
                          $query->where([
                            ['checked_at', null],
                            ['list_type', 'ta']
                          ]);
                      }])
                      ->orderBy('title', 'asc')
                      ->get();
    }

    public function setItemSortOrder(Request $request, Checklist $checklist)
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
                     ->where('checklist_id', $checklist->id)
                     ->orderBy('sort_order')
                     ->latest()
                     ->get();
          if($items) {
            foreach ($items as $key => $item) $itemsToUpdate[$item->id] = $key;
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
      $updateSQLQuery .= " END WHERE checklist_id = ".$checklist->id." AND id IN (" . implode(",",$ids) . ");";

      if(isset($itemsToUpdate) && ! empty($itemsToUpdate)) $sorted_count = DB::update( $updateSQLQuery );

      if(isset($sorted_count)) $response['sorted_count'] = $sorted_count;

      return response()->json($response);
    }

    public function getKanbanDescendants($nestedKanban)
    {
      $checklist = Checklist::where('id', $nestedKanban['id'])
                    ->with('sections:id,fake_id,title,parent_id', 'items:id,content,checklist_id')
                    ->first();
      return [
        'sections' => $checklist->sections,
        'items' => $checklist->items
      ];
    }

}
