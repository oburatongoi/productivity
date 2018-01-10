<?php

namespace Oburatongoi\Productivity\Http\Controllers;

use Illuminate\Http\Request;

use Oburatongoi\Productivity\Http\Controllers\ProductivityBaseController as Controller;

use Oburatongoi\Productivity\Repositories\Decorators\CacheableFolders as Folders;
use Oburatongoi\Productivity\Repositories\Decorators\CacheableChecklists as Checklists;
use Oburatongoi\Productivity\Repositories\Decorators\CacheableChecklistItems as ChecklistItems;
use Oburatongoi\Productivity\Folder;

// use Illuminate\Support\Facades\Cache;

use AlgoliaSearch\AlgoliaException as AlgoliaException;

use JavaScript, Bugsnag, Exception;
use Bouncer;

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
            'checklistItems' => $this->items->pendingForUser($request->user())
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
          // 'checklists' => $this->checklists->rootForUser($request->user())
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
      $parent = $folder = null;
      $response = [];

      if ($request->has('folder.folder_id')) $parent = Folder::find($request->input('folder.folder_id'));

      try {

        $folder = $request->user()->folders()->create($request->input('folder'));
        if($parent) $parent->appendNode($folder);

      // } catch (AlgoliaException $e) {
      //   // $folder = $request->user()->folders()->orderBy('created_at', 'desc')->first();
      //   $folder = $request->user()->folders()->latest()->first();
      //
      //   if ($folder->name == $request->input('folder.name')) { // Due to encryption, $folder must be retrieved first
      //     Folder::withoutSyncingToSearch(function () use  ($parent, $folder) {
      //         if($parent) $parent->appendNode($folder);
      //         // To Do: Add to queue so that the change gets indexed
      //     });
      //   }
      //
      //   $response['exceptions'][] = $e->getMessage();
      //   $response['originalInput'][] = $request->except(['password', 'password_confirmation']);

      } catch (Exception $e) {

        $response['exceptions'][] = $e->getMessage();
        $response['originalInput'][] = $request->except(['password', 'password_confirmation']);

      }

      $response['parent'] = $parent;
      $response['folder'] = $folder;
      return response()->json($response);

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
            'folders' => $this->folders->rootForFolder($request->user(), $folder),
            'currentFolder' => $folder->load('folder', 'children'),
            'checklists' => $this->checklists->forFolder($request->user(), $folder),
            'ancestors' => $folder->getAncestors(),
            'checklistItems' => $this->items->pendingForFolder($folder)
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
      $this->authorize('modify', $folder);

      $this->validate($request, [
          'folder.name' => 'required|max:255',
          'folder.id' => 'required|integer',
          'folder.fake_id' => 'required|integer',
      ]);

      $response = [];

      try {
        $folder->update($request->input('folder'));
      } catch (AlgoliaException $e) {
        $response['exceptions'][] = $e->getMessage();
      } catch (Exception $e) {
        $response['exceptions'][] = $e->getMessage();
      }

      $response['folder'] = $folder;
      return response()->json($response);
    }

}
