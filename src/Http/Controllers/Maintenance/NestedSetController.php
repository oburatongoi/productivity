<?php

namespace Oburatongoi\Productivity\Http\Controllers\Maintenance;

use Illuminate\Http\Request;
use Oburatongoi\Productivity\Http\Controllers\ProductivityBaseController as Controller;
// use Oburatongoi\Productivity\Checklist;
use Oburatongoi\Productivity\Folder;
use AlgoliaSearch\AlgoliaException as AlgoliaException;




class NestedSetController extends Controller
{
    public function __construct()
    {
        $this->middleware('web');
        $this->middleware('auth');
    }

    public function fixTree()
    {
        try {

          $tree = Folder::fixTree();

          return response()->json([
              'fixed' => $tree
          ]);

        } catch (AlgoliaException $e) {
          // WIP: Add to some sort of queue to sync to algolia
          Folder::withoutSyncingToSearch(function () {
              $tree = Folder::fixTree();
          });

          return response()->json([
              'fixed' => $tree
          ]);
        } catch (Exception $e) {

          // $this->handleException($e);

          return response()->json([
              'exception' => $e->getMessage()
          ]);

        }

    }

}
