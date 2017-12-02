<?php

namespace Oburatongoi\Productivity\Http\Controllers;

use Illuminate\Http\Request;
use Oburatongoi\Productivity\Http\Controllers\ProductivityBaseController as Controller;

use Oburatongoi\Productivity\Repositories\Checklists;
use Oburatongoi\Productivity\Checklist;
use JavaScript;

class ChecklistController extends Controller
{

    protected $checklists;

    public function __construct(Checklists $checklists)
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
    public function index($account, Request $request)
    {
        JavaScript::put([
            'checklists' => $this->checklists->forUser($request->user())
        ]);

        return view('productivity::checklists.index')
                ->withTitle('Lists - Productivity - ' . config('app.name'));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store($account, Request $request)
    {

        try {
          if ($response['checklist'] = $request->user()->checklists()->create($request->input('checklist')))
          return response()->json($response);

        } catch (\Exception $e) {
          return $this->handleException($e);
        }


    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($account, Request $request, Checklist $checklist)
    {
        $this->authorize('view', $checklist);

        $checklist->load(['items' => function($query) {
            $query->orderBy(\DB::raw('-`deadline`'), 'desc');
            $query->orderBy('created_at', 'desc');
            $query->latest();
        }]);

        JavaScript::put([
          'checklist' => $checklist,
          'ancestors' => $checklist->getFolderTree(),
          'currentFolder' => $checklist->folderById()
        ]);

        return view('productivity::checklists.show')
            ->withChecklist($checklist)
            ->withTitle($checklist->title . ' - Productivity - ' . config('app.name'));
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update($account, Request $request, Checklist $checklist)
    {

        $this->authorize('modify', $checklist);

        $checklist->update($request->checklist);

        return response()->json([
            'checklist' => $checklist
        ]);
    }

}
