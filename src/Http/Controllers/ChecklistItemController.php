<?php

namespace Oburatongoi\Productivity\Http\Controllers;

use Illuminate\Http\Request;

use Oburatongoi\Productivity\Http\Controllers\ProductivityBaseController as Controller;

use Oburatongoi\Productivity\Checklist;
use Oburatongoi\Productivity\ChecklistItem;

use Carbon\Carbon;

class ChecklistItemController extends Controller
{

    public function __construct()
    {
        $this->middleware('web');
        $this->middleware('auth');
    }
    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request, Checklist $checklist)
    {
        $this->authorize('modify', $checklist);

        $this->validate($request, [
            'item.content' => 'required|max:255',
            'item.is_urgent' => 'boolean',
            'item.is_important' => 'boolean',
            'item.deadline' => 'nullable|date',
        ]);

        $item = $checklist->items()->create($request->input('item'));

        return response()->json([
            'item' => $item
        ]);
    }

    public function update(Request $request, ChecklistItem $item)
    {
        $this->authorize('modify', $item->checklistById());

        $this->validate($request, [
            'item.content' => 'required|max:255',
            'item.is_urgent' => 'boolean',
            'item.is_important' => 'boolean',
            'item.deadline' => 'nullable|date',
            'item.checked_at' => 'nullable|date',
        ]);

        if ($request->input('item.checked_at')) {
            $item->checked_at = Carbon::createFromFormat('Y-m-d\TH:i:sP',$request->item['checked_at'])->toDateTimeString();
        } else $item->checked_at = null;

        if ($request->has('item.content')) $item->content = $request->item['content'];
        $item->comments = $request->item['comments'];
        $item->is_urgent = $request->item['is_urgent'];
        $item->is_important = $request->item['is_important'];
        $item->deadline = $request->item['deadline'] ?: null;

        $item->save();

        return response()->json([
            'item' => $item
        ]);
    }

    // public function check(Request $request, ChecklistItem $item)
    // {
    //     $this->authorize('modify', $item->checklistById());
    //
    //     $this->validate($request, [
    //         'action' => 'required',
    //     ]);
    //
    //     try {
    //
    //         if ($request->input('action') && $request->input('action') == 'check') {
    //             $item->checked_at = date('Y-m-d H:i:s');
    //         } else {
    //             $item->checked_at = null;
    //         }
    //
    //         $item->save();
    //
    //         return response()->json([
    //             'item' => $item
    //         ]);
    //
    //     } catch (\Exception $e) {
    //         return response()->json([
    //             'errorMessage' => $e->getMessage(),
    //             'errorCode' => $e->getCode(),
    //             'status' => 420,
    //         ]);
    //     }
    //
    //
    //
    // }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy(Request $request, ChecklistItem $item)
    {
        $this->authorize('modify', $item->checklistById());

        // $item->delete();
        //
        // return response()->json([
        //     'item' => $item
        // ]);

        try {

            $item->delete();

            return response()->json([
                'item' => $item
            ]);

        } catch (Exception $e) {

            return response()->json([
                'error' => $e
            ]);

        }
    }
}
