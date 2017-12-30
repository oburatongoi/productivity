<?php

namespace Oburatongoi\Productivity\Http\Controllers;

use Illuminate\Http\Request;
use Oburatongoi\Productivity\Http\Controllers\ProductivityBaseController as Controller;
use App\User;
use Oburatongoi\Productivity\Folder;
use Oburatongoi\Productivity\Checklist;

use Bouncer;

class AuthController extends Controller
{

    public function __construct()
    {
        $this->middleware('web');
        $this->middleware('auth');
    }

    /**
     * Change a user's access to a resource.
     * @param $verb. Options are: allow, disallow
     * @return \Illuminate\Http\Response
     */
    public function setAccess($account, Request $request, $verb, User $user, $access, $model, $id)
    {
      if (! $verb || ! $user || ! $access || ! $model || ! $id) {
        return response()->json(['error' => 'Hmmm, we seem to be missing some parameters.']);
      }

      switch ($model) {
        case 'folder':
          $resource = Folder::where('fake_id', $id)->first();
          break;
        case 'checklist':
          $resource = Checklist::where('fake_id', $id)->first();
          break;
      }

      $this->authorize('admin', $resource);

      if($resource) {
        $user->$verb($access, $resource);
        Bouncer::refreshFor($user);
        return response()->json(['success' => true]);
      }
      return response()->json(['error' => 'Hmmm, the resource could not be found.']);

    }

    /**
     * Change a user's access to a resource.
     * @param $verb. Options are: allow, disallow
     * @return \Illuminate\Http\Response
     */
    public function getAbilities($account, Request $request)
    {
      return response()->json([
        'abilities' => $request->user()->getAbilities()->where('entity_type', 'Oburatongoi\Productivity\Checklist')
      ]);

    }
}
