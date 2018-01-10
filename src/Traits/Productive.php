<?php

namespace Oburatongoi\Productivity\Traits;

/**
 * This trait adds Productivity-specific methods to a User model.
 *
 */
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
