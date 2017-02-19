<?php

namespace Oburatongoi\Productivity\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Controllers\Controller;

use Oburatongoi\Productivity\Repositories\FolderRepository;
use Oburatongoi\Productivity\Repositories\ChecklistRepository;
// use Oburatongoi\Productivity\Repositories\NoteRepository;
// use Oburatongoi\Productivity\Repositories\GoalRepository;
use Oburatongoi\Productivity\Folder;

use JavaScript;

class FolderController extends Controller
{

    protected $folders;
    protected $checklists;
    // protected $notes;
    // protected $goals;

    public function __construct(
        FolderRepository $folders,
        ChecklistRepository $checklists
        // NoteRepository $notes,
        // GoalRepository $goals
    ) {
        $this->middleware('web');
        $this->middleware('auth');

        $this->folders = $folders;
        $this->checklists = $checklists;
        // $this->notes = $notes;
        // $this->goals = $goals;
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        JavaScript::put([
            'user' => $request->user(),
            'folders' => $this->folders->rootForUser($request->user()),
            'checklists' => $this->checklists->rootForUser($request->user()),
            // 'notes' => $this->notes->rootForUser($request->user()),
            // 'goals' => $this->goals->rootForUser($request->user()),
            'model' => 'folders',
        ]);

        return view('productivity::folders.index')->with([
            'model' => 'folders',
        ]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {

        $folder = $request->user()->folders()->create($request->input('folder'));

        if (
        $request->has('folder.folder_id')
        && $parent = Folder::find($request->input('folder.folder_id'))
        ) {
            $parent->appendNode($folder);
        }

        $folder->fakeID();

        return response()->json([
            'folder' => $folder
        ]);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show(Request $request, Folder $folder)
    {
        $this->authorize('view', $folder);

        JavaScript::put([
            'user' => $request->user(),
            'folders' => $this->folders->rootForFolder($folder),
            'currentFolder' => $folder,
            'checklists' => $this->checklists->forFolder($folder),
            // 'notes' => $this->notes->forFolder($folder),
            // 'goals' => $this->goals->forFolder($folder),
            'ancestors' => $folder->getAncestors(),
            'model' => 'folder',
        ]);

        return view('productivity::folders.show')->withModel('folder');
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Folder $folder)
    {
        $this->authorize('modify', $folder);

        $folder->update($request->input('folder'));

        return response()->json([
            'folder' => $folder
        ]);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy(Request $request, Folder $folder)
    {
        $this->authorize('modify', $folder);

        $folder->delete();

        return response()->json([
            'folder' => $folder
        ]);
    }
}
