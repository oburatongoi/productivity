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

    public function items()
    {
      return $this->hasManyThrough('Oburatongoi\Productivity\ChecklistItem', 'Oburatongoi\Productivity\Checklist');
    }
}
