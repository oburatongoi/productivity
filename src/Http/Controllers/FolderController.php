<?php

namespace Oburatongoi\Productivity\Http\Controllers;

use Illuminate\Http\Request;

use Oburatongoi\Productivity\Http\Controllers\ProductivityBaseController as Controller;

use Oburatongoi\Productivity\Repositories\FolderRepository;
use Oburatongoi\Productivity\Repositories\ChecklistRepository;
use Oburatongoi\Productivity\Folder;

use JavaScript;

class FolderController extends Controller
{

    protected $folders;
    protected $checklists;

    public function __construct(
        FolderRepository $folders,
        ChecklistRepository $checklists
    ) {
        $this->middleware('web');
        $this->middleware('auth');

        $this->folders = $folders;
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
            'folders' => $this->folders->rootForUser($request->user()),
            'checklists' => $this->checklists->rootForUser($request->user()),
            'model' => 'folders',
            'currentView' => 'foldersIndex'
        ]);

        return view('productivity::folders.index')
                ->withTitle('Folders - Productivity - ' . config('app.name'));
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
            'currentFolder' => $folder->load('folder', 'subfolders'),
            'checklists' => $this->checklists->forFolder($folder),
            'ancestors' => $folder->getAncestors(),
            'model' => 'folder',
        ]);

        return view('productivity::folders.show')
                ->withModel('folder')
                ->withTitle($folder->name . ' - Productivity - ' . config('app.name'));
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

    public function fetchInitialTree(Request $request)
    {
        $folders = Folder::select('name', 'fake_id', 'id')
                    ->where('folder_id', $request->input('folder_id'))
                    ->orderBy('name', 'asc')
                    ->with('folder')
                    ->get();

        return response()->json([
            'folders' => $folders
        ]);
    }

    public function fetchNewTree(Request $request, Folder $folder)
    {
        $folder->load('folder', 'subfolders');

        return response()->json([
            'folder' => $folder
        ]);
    }

    public function moveToFolder(Request $request, Folder $folder)
    {

        switch ($request->input('child.model')) {
            case 'folder':
                $child = Folder::where('fake_id', $request->input('child.id'))->first();
                break;
            case 'checklist':
                $child = \Oburatongoi\Productivity\Checklist::where('fake_id', $request->input('child.id'))->first();
                break;
        }

        $child->moveToFolder($folder);

        return response()->json([
            'folder' => $folder,
            'child' => $child
        ]);
    }

    public function moveToHome(Request $request)
    {

        switch ($request->input('child.model')) {
            case 'folder':
                $child = Folder::where('fake_id', $request->input('child.id'))->first();
                break;
            case 'checklist':
                $child = \Oburatongoi\Productivity\Checklist::where('fake_id', $request->input('child.id'))->first();
                break;
        }

        $child->moveToHome();

        return response()->json([
            'child' => $child
        ]);
    }

    public function fixTree()
    {
        $tree = Folder::fixTree();

        return response()->json([
            'fixed' => $tree
        ]);
    }
}
