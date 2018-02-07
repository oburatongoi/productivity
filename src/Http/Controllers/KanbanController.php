<?php

namespace Oburatongoi\Productivity\Http\Controllers;

use Illuminate\Http\Request;
use Oburatongoi\Productivity\Http\Controllers\ProductivityBaseController as Controller;
use Oburatongoi\Productivity\Repositories\Decorators\CacheableFolders as Folders;
use Oburatongoi\Productivity\Repositories\Decorators\CacheableChecklists as Checklists;
use Oburatongoi\Productivity\Repositories\Decorators\CacheableChecklistItems as ChecklistItems;

class KanbanController extends Controller
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

  public function fetchDescendants(Request $request)
  {
    switch ($request->nestedKanban['model']) {
      case 'folder':
        $descendants = $this->folders->getKanbanDescendants($request->nestedKanban);
        break;
      case 'checklist':
        $descendants = $this->checklists->getKanbanDescendants($request->nestedKanban);
        break;
      case 'checklist-item':
        $descendants = $this->items->getKanbanDescendants($request->nestedKanban);
        break;

      default:
        return response()->json(['error' => 'No valid model was provided.']);
        break;
    }

    return response()->json(['descendants' => $descendants]);
  }
}
