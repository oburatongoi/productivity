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
        return $user->checklists()->withCount(['items' => function($query) {
            $query->where('checked_at', null);
        }])->orderBy('title', 'asc')->get();
    }

    public function rootForUser(User $user)
    {
        return $user->checklists()->whereNull('folder_id')->whereNull('parent_id')->withCount(['items' => function($query) {
            $query->where('checked_at', null);
        }])->orderBy('title', 'asc')->get();
    }

    public function forFolder(User $user, Folder $folder)
    {
        return $folder->checklists()->withCount(['items' => function($query) {
            $query->where([
              ['checked_at', null],
              ['list_type', 'ta']
            ]);
        }])->orderBy('title', 'asc')->get();
    }

    public function setItemSortOrder(Request $request, Checklist $checklist)
    {
      $response = [];

      // If a list of checklist items is included, use these to maintain proper ordering with the front end
      if($request->checklistItems) {
        foreach ($request->checklistItems as $key => $item) {

          try {
            $updated = $checklist->items()
                      ->where('id', $item['id'])
                      ->where('sort_order', '!=', $item['sort_order'])
                      ->update([ 'sort_order' => $key ]);
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
                 ->where('checklist_id', $checklist->id)
                 ->orderBy('sort_order')
                 ->latest()
                 ->get();
        if($items) {
          foreach ($items as $key => $item) {

            try {
               $updated = DB::table('productivity_checklist_items')
                            ->where([
                              ['id', $item->id],
                              ['checklist_id', $checklist->id]
                            ])
                            ->update([ 'sort_order' => $key ]);
               if(isset($updated)) $response['items'][] = $item->id;
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
