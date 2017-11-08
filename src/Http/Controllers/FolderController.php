<?php

namespace Oburatongoi\Productivity\Http\Controllers;

use Illuminate\Http\Request;

use Oburatongoi\Productivity\Http\Controllers\ProductivityBaseController as Controller;

use Oburatongoi\Productivity\Repositories\Decorators\CacheableFolders as Folders;
use Oburatongoi\Productivity\Repositories\Decorators\CacheableChecklists as Checklists;
use Oburatongoi\Productivity\Repositories\Decorators\CacheableChecklistItems as ChecklistItems;
use Oburatongoi\Productivity\Folder;

// use Illuminate\Support\Facades\Cache;

use JavaScript, Bugsnag;

class FolderController extends Controller
{

    protected $folders;
    protected $checklists;
    protected $items;

    public function __construct(
        Folders $folders,
        Checklists $checklists,
        ChecklistItems $items
    ) {
        $this->middleware('web');
        $this->middleware('auth');

        $this->folders = $folders;
        $this->checklists = $checklists;
        $this->items = $items;
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function home($account, Request $request)
    {
        JavaScript::put([
            'folders' => $this->folders->rootForUser($request->user()),
            'checklists' => $this->checklists->rootForUser($request->user()),
            'pendingItems' => $this->items->pendingForUser($request->user()),
            'currentView' => 'home'
        ]);

        // return view('productivity::home.index')
        return view('productivity::folders.show')
                ->withTitle('Home - Productivity - ' . config('app.name'));
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index($account, Request $request)
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
    public function store($account, Request $request)
    {
        try {

          $folder = $request->user()->folders()->create($request->input('folder'));

          if (
          $request->has('folder.folder_id') // If folder id exists in the request...
          && $parent = Folder::find($request->input('folder.folder_id')) // If the folder id matches an existing folder, retrieve it
          ) {
              $parent->appendNode($folder);
              // Cache::forget('user.'.$request->user()->id.'.folder.'.$folder->id.'.subFolders');
          } else {
              // Cache::forget('user.'.$request->user()->id.'.rootFolders');
          }

          return response()->json([
              'folder' => $folder
          ]);

        } catch (Exception $e) {

          $this->handleException($e);

        }

    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($account, Request $request, Folder $folder)
    {
        $this->authorize('view', $folder);

        JavaScript::put([
            'user' => $request->user(),
            'folders' => $this->folders->rootForFolder($request->user(), $folder),
            'currentFolder' => $folder->load('folder', 'subfolders'),
            'checklists' => $this->checklists->forFolder($request->user(), $folder),
            'ancestors' => $folder->getAncestors(),
            'pendingItems' => $this->items->pendingForFolder($folder),
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
    public function update($account, Request $request, Folder $folder)
    {

        try {

          $this->authorize('modify', $folder);

          $folder->update($request->input('folder'));

          return response()->json([
              'folder' => $folder
          ]);

        } catch (Exception $e) {

          $this->handleException($e);

        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($account, Request $request, Folder $folder)
    {

        try {

          $this->authorize('modify', $folder);

          $folder->delete();

          return response()->json([
              'folder' => $folder
          ]);

        } catch (Exception $e) {

          $this->handleException($e);

        }

    }

}
