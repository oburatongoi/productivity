<?php

namespace Oburatongoi\Productivity\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Controllers\Controller;

use Oburatongoi\Productivity\Repositories\FolderRepository;
use Oburatongoi\Productivity\Folder;

class FolderController extends Controller
{

    protected $folders;

    public function __construct(FolderRepository $folders)
    {
        $this->folders = $folders;
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $folders = $folders->forUser($request->user());

        return view('productivity::folders.index')->withFolders($folders);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $folder = Folder::create($request->input('folder'));

        if (
        $request->has('folder.parentId')
        && $parent = Folder::find($request->input('folder.parentId'))
        ) {
            $folder->makeChildOf($parent);
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

        $folder->load('checklists', 'goals', 'notes', 'subfolders');

        return view('productivity::folder.show')->withFolder($folder);
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
