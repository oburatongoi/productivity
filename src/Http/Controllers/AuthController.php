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
    }

    public function grantFolderAccess($account, Request $request, User $user, $access, Folder $folder)
    {
      if($access) {
        $user->allow($access, $folder);
        Bouncer::refreshFor($user);
        return response()->json(['success' => true]);
      }
      return response()->json(['error' => 'No permission was specified']);
    }

    public function revokeFolderAccess($account, Request $request, User $user, $access, Folder $folder)
    {
      if($access) {
        $user->disallow($access, $folder);
        Bouncer::refreshFor($user);
        return response()->json(['success' => true]);
      }
      return response()->json(['error' => 'No permission was specified']);
    }

    public function grantChecklistAccess($account, Request $request, User $user, $access, Checklist $checklist)
    {
      if($access) {
        $user->allow($access, $checklist);
        Bouncer::refreshFor($user);
        return response()->json(['success' => true]);
      }
      return response()->json(['error' => 'No permission was specified']);
    }

    public function revokeChecklistAccess($account, Request $request, User $user, $access, Checklist $checklist)
    {
      if($access) {
        $user->disallow($access, $checklist);
        Bouncer::refreshFor($user);
        return response()->json(['success' => true]);
      }
      return response()->json(['error' => 'No permission was specified']);
    }
}
