<?php

namespace Oburatongoi\Productivity;

use App\User;

class User extends User
{
    public function folders()
    {
        return $this->hasMany('App\Folder');
    }

    public function checklists()
    {
        return $this->hasMany('App\Checklist');
    }

    public function notes()
    {
        return $this->hasMany('App\Note');
    }

    public function goals()
    {
        return $this->hasMany('App\Goal');
    }
}
