<?php

namespace Oburatongoi\Productivity\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Controllers\Controller;

use Oburatongoi\Productivity\Checklist;
use Oburatongoi\Productivity\ChecklistItem;

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
            'item.deadline' => 'date',
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
            'item.deadline' => 'date',
        ]);

        $item->update($request->input('item'));

        return response()->json([
            'item' => $item
        ]);
    }

    public function check(Request $request, ChecklistItem $item)
    {
        $this->authorize('modify', $item->checklistById());

        $this->validate($request, [
            'action' => 'required',
        ]);

        if ($request->input('action') && $request->input('action') == 'check') {
            $item->checked_at = date('Y-m-d H:i:s');
        } else {
            $item->checked_at = null;
        }

        $item->save();

        return response()->json([
            'item' => $item
        ]);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy(Request $request, ChecklistItem $item)
    {
        $this->authorize('modify', $item->checklistById());

        $item->delete();

        return response()->json([
            'item' => $item
        ]);
    }
}
