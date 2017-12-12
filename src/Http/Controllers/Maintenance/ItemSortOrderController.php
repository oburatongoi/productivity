<?php

namespace Oburatongoi\Productivity\Http\Controllers\Maintenance;

use Illuminate\Http\Request;
use Oburatongoi\Productivity\Http\Controllers\ProductivityBaseController as Controller;
use Oburatongoi\Productivity\Repositories\Checklists;
use Oburatongoi\Productivity\Repositories\ChecklistItems;
use Oburatongoi\Productivity\Checklist;
use Oburatongoi\Productivity\ChecklistItem;
use Exception;

class ItemSortOrderController extends Controller
{

    protected $checklists;
    protected $items;

    public function __construct(Checklists $checklists, ChecklistItems $items)
    {
        $this->middleware('web');
        $this->middleware('auth');

        $this->checklists = $checklists;
        $this->items = $items;
    }

    public function setSortOrder(Request $request)
    {
      $allItems = $response = [];

      $sortedChecklists = $this->setChecklistSortOrder($request);
      $sortedChecklistItems = $this->setChecklistItemSortOrder($request);

      if (! empty($sortedChecklists['allItems'])) {
        $allItems = array_merge($allItems, $sortedChecklists['allItems']);
      }

      if (! empty($sortedChecklistItems['allItems'])) {
        $allItems = array_merge($allItems, $sortedChecklistItems['allItems']);
      }

      $uniqueAllItems = array_unique($allItems, SORT_NUMERIC);
      sort($uniqueAllItems, SORT_NUMERIC);

      $response['allItems'][] = $uniqueAllItems;

      return view('productivity::maintenance.previews')->withData(
        response()->json($response, 200, array(), JSON_PRETTY_PRINT)
      );
    }

    public function setChecklistSortOrder(Request $request)
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

      return $response;
    }

    public function setChecklistItemSortOrder(Request $request)
    {
      $allItems = $response = [];

      try {
        $items = ChecklistItem::withTrashed()->get();
      } catch (Exception $e) {
        $response['exceptions'][] = $e->getMessage();
      }

      if ($items) {
        foreach ($items as $item) {
          $sorted = $this->items->setItemSortOrder($request, $item);

          $sortedItems = count($sorted) ? $sorted['items'] : [];

          $response['sorted'][] = [
            'item' => $item->id,
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

      return $response;
    }

}
