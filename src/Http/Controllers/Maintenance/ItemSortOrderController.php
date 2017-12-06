<?php

namespace Oburatongoi\Productivity\Http\Controllers\Maintenance;

use Illuminate\Http\Request;
use Oburatongoi\Productivity\Http\Controllers\ProductivityBaseController as Controller;
use Oburatongoi\Productivity\Repositories\Checklists;
use Oburatongoi\Productivity\Checklist;
use Exception;

class ItemSortOrderController extends Controller
{

    protected $checklists;

    public function __construct(Checklists $checklists)
    {
        $this->middleware('web');
        $this->middleware('auth');

        $this->checklists = $checklists;
    }

    public function setItemSortOrder(Request $request)
    {
      $allItems = $response = [];

      try {
        $checklists = Checklist::withTrashed()->get();
      } catch (Exception $e) {
        $response['exceptions'][] = $e->getMessage();
      }

      if ($checklists) {
        foreach ($checklists as $checklist) {
          $sorted = $this->checklists->setItemSortOrder($request, $checklist);

          $sortedItems = count($sorted) ? $sorted['items'] : [];

          $response['sorted'][] = [
            'checklist' => $checklist->id,
            'items' => $sortedItems
          ];
          $allItems = array_merge($allItems, $sortedItems);

        }
      } else {
        $response['exceptions'][] = 'No checklists were retrieved from the database.';
      }

      $uniqueAllItems = array_unique($allItems, SORT_NUMERIC);
      sort($uniqueAllItems, SORT_NUMERIC);

      $response['allItems'][] = $uniqueAllItems;

      return view('productivity::maintenance.previews')->withData(
        response()->json($response, 200, array(), JSON_PRETTY_PRINT)
      );
    }

}
