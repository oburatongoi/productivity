<?php

namespace Oburatongoi\Productivity\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Controllers\Controller;

use Oburatongoi\Productivity\Repositories\ChecklistRepository;
use Oburatongoi\Productivity\Checklist;
use JavaScript;

class ChecklistController extends Controller
{
    protected $checklists;

    public function __construct(ChecklistRepository $checklists)
    {
        $this->middleware('web');
        $this->middleware('auth');

        $this->checklists = $checklists;
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        JavaScript::put([
            'checklists' => $this->checklists->forUser($request->user()),
            'model' => 'checklists',
            'currentView' => 'checklistsIndex'
        ]);

        return view('productivity::checklists.index');
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $checklist = $request->user()->checklists()->create($request->input('checklist'));

        $checklist->fakeID();

        return response()->json([
            'checklist' => $checklist
        ]);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show(Request $request, Checklist $checklist)
    {
        $this->authorize('view', $checklist);

        $checklist->load(['items' => function($query) {
            $query->orderBy('deadline', 'asc');
        }]);

        JavaScript::put([
            'checklist' => $checklist,
            'ancestors' => $checklist->getFolderTree(),
            'model' => 'list',
        ]);

        return view('productivity::checklists.show')->withChecklist($checklist);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Checklist $checklist)
    {

        $this->authorize('modify', $checklist);

        $checklist->update($request->checklist);

        return response()->json([
            'checklist' => $checklist
        ]);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy(Request $request, Checklist $checklist)
    {
        $this->authorize('modify', $checklist);

        $checklist->delete();

        return response()->json([
            'checklist' => $checklist
        ]);
    }
}
