<?php

namespace Oburatongoi\Productivity\Traits;

trait Productive
{
    public function folders()
    {
        return $this->hasMany('Oburatongoi\Productivity\Folder');
    }

    public function checklists()
    {
        return $this->hasMany('Oburatongoi\Productivity\Checklist');
    }

    public function notes()
    {
        return $this->hasMany('Oburatongoi\Productivity\Note');
    }

    public function goals()
    {
        return $this->hasMany('Oburatongoi\Productivity\Goal');
    }
}
