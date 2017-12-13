<?php

namespace Oburatongoi\Productivity\Http\Controllers;

use Illuminate\Http\Request;
use Oburatongoi\Productivity\Http\Controllers\ProductivityBaseController as Controller;
use Oburatongoi\Productivity\Repositories\Checklists;
use Oburatongoi\Productivity\Repositories\ChecklistItems;
use Oburatongoi\Productivity\Checklist;
use Oburatongoi\Productivity\ChecklistItem;
use Carbon\Carbon;
use AlgoliaSearch\AlgoliaException;
use Bugsnag, Exception;

class ChecklistItemController extends Controller
{
  protected $checklists;

    public function __construct(Checklists $checklists)
    {
        $this->middleware('web');
        $this->middleware('auth');
        $this->checklists = $checklists;
    }
    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store($account, Request $request, Checklist $checklist)
    {
      $this->authorize('modify', $checklist);

      $this->validate($request, [
          'item.content' => 'required|max:255',
          'item.is_urgent' => 'boolean',
          'item.is_important' => 'boolean',
          'item.deadline' => 'nullable|date',
          'item.sort_order' => 'nullable|integer',
      ]);

      $newItem['deadline'] = $request->has('item.deadline') ? Carbon::parse($request->item['deadline'])->toDateTimeString() : null;

      if ($request->has('item.content')) $newItem['content'] = $request->item['content'];
      if ($request->has('item.comments')) $newItem['comments'] = $request->item['comments'];
      if ($request->has('item.is_urgent')) $newItem['is_urgent'] = $request->item['is_urgent'];
      if ($request->has('item.is_important')) $newItem['is_important'] = $request->item['is_important'];
      if ($request->has('item.sort_order')) $newItem['sort_order'] = $request->item['sort_order'];

      try {
        if(isset($newItem) && ! empty($newItem)) {
          $response['item'] = $checklist->items()->create($newItem);
          if(empty($response['item']['child_list_items'])) $response['item']['child_list_items'] = []; // fixes bug in Vue code
        } else {
          $response['exceptions'][] = 'The new item had no defined properties.';
        }
      } catch (AlgoliaException $e) {
        $response['exceptions'][] = $e->getMessage();
      } catch (Exception $e) {
        $response['exceptions'][] = $e->getMessage();
      }

      return response()->json($response);
    }

    /**
     * Store a newly created sub item in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function storeSubItem($account, Request $request, ChecklistItem $item)
    {
      $this->authorize('modify', $item);

      $this->validate($request, [
          'item.content' => 'required|max:255',
          'item.is_urgent' => 'boolean',
          'item.is_important' => 'boolean',
          'item.deadline' => 'nullable|date',
          'item.sort_order' => 'nullable|integer',
      ]);

      $newItem['deadline'] = $request->has('item.deadline') ? Carbon::parse($request->item['deadline'])->toDateTimeString() : null;

      if ($request->has('item.content')) $newItem['content'] = $request->item['content'];
      if ($request->has('item.comments')) $newItem['comments'] = $request->item['comments'];
      if ($request->has('item.is_urgent')) $newItem['is_urgent'] = $request->item['is_urgent'];
      if ($request->has('item.is_important')) $newItem['is_important'] = $request->item['is_important'];
      if ($request->has('item.sort_order')) $newItem['sort_order'] = $request->item['sort_order'];

      try {
        if(isset($newItem) && ! empty($newItem)) {
          $response['item'] = $item->child_list_items()->create($newItem);
          if(empty($response['item']['child_list_items'])) $response['item']['child_list_items'] = []; // fixes bug in Vue code
        } else {
          $response['exceptions'][] = 'The new item had no defined properties.';
        }
      } catch (AlgoliaException $e) {
        $response['exceptions'][] = $e->getMessage();
      } catch (Exception $e) {
        $response['exceptions'][] = $e->getMessage();
      }

      return response()->json($response);
    }

    public function update($account, Request $request, ChecklistItem $item)
    {
      $this->authorize('modify', $item->checklist()->first());

      $this->validate($request, [
          'item.content' => 'required|max:255',
          'item.is_urgent' => 'boolean',
          'item.is_important' => 'boolean',
          'item.deadline' => 'nullable|date',
          'item.checked_at' => 'nullable|date',
          'item.sort_order' => 'nullable|integer',
      ]);

      $item->checked_at = $request->input('item.checked_at') ? Carbon::parse($request->item['checked_at'])->toDateTimeString() : null;

      $item->deadline = $request->has('item.deadline') ? Carbon::parse($request->item['deadline'])->toDateTimeString() : null;

      if ($request->has('item.content')) $item->content = $request->item['content'];
      if ($request->has('item.comments')) $item->comments = $request->item['comments'];
      if ($request->has('item.is_urgent')) $item->is_urgent = $request->item['is_urgent'];
      if ($request->has('item.is_important')) $item->is_important = $request->item['is_important'];
      if ($request->has('item.sort_order')) $item->sort_order = $request->item['sort_order'];

      try {
        $response['item'] = $item->save();
      } catch (AlgoliaException $e) {
        $response['exceptions'][] = $e->getMessage();
      } catch (Exception $e) {
        $response['exceptions'][] = $e->getMessage();
      }

      $response['item'] = $item;

      return response()->json($response);
    }

    public function check($account, Request $request, ChecklistItem $item)
    {
      $this->authorize('modify', $item->checklist()->first());

      $this->validate($request, [
          'item.checked_at' => 'nullable|date',
      ]);

      $item->checked_at = $request->input('item.checked_at') ? Carbon::parse($request->item['checked_at'])->toDateTimeString() : null;

      try {
        $response['item'] = $item->save();
      } catch (AlgoliaException $e) {
        $response['exceptions'][] = $e->getMessage();
      } catch (Exception $e) {
        $response['exceptions'][] = $e->getMessage();
      }

      $response['item'] = $item;

      return response()->json($response);
    }

    public function saveSortOrder($account, Request $request)
    {
      if ($request->parentModel == 'checklist') {
        $checklist = Checklist::where('fake_id', $request->parent['fake_id'])->firstOrFail();

        $this->authorize('modify', $checklist);

        return $this->checklists->setItemSortOrder($request, $checklist);
      }

      if ($request->parentModel == 'checklist-item') {
        $item = ChecklistItem::where('id', $request->parent['id'])->firstOrFail();

        $this->authorize('modify', $item);

        return ChecklistItems::setItemSortOrder($request, $item);
      }


    }
}
