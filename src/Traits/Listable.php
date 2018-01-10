<?php namespace Oburatongoi\Productivity\Traits;

use Oburatongoi\Productivity\Checklist;
use Oburatongoi\Productivity\ChecklistItem;

use Auth;

trait Listable
{

    public function checklist()
    {
        if ($this instanceof ChecklistItem && $this->parent_id) return $this->parent->checklist();
        return $this->belongsTo('Oburatongoi\Productivity\Checklist', 'checklist_id');
    }

    public function moveToChecklist(Checklist $checklist)
    {
      if (Auth::user()->can('modify', $this)) {
        // first, remove old associations, if any
        if($this instanceof ChecklistItem && $this->parent_id) $this->parent()->dissociate();
        if($this instanceof Checklist && $this->folder_id) $this->folder()->dissociate();
        // next, create the new association
        return $this->checklist()->associate($checklist)->save();
      }
      return false; // Only authorized users may move a ChecklistItem
    }

    public function moveToChecklistItem(ChecklistItem $item)
    {
      if (Auth::user()->can('modify', $this)) {
        if($this instanceof ChecklistItem) {
          // first, remove old associations, if any
          if($this->checklist_id) $this->checklist()->dissociate();
          return $this->parent()->associate($item)->save();
        }
        return false; // Only allow ChecklistItems to move to ChecklistItem
      }
      return false; // Only authorized users may move a ChecklistItem
    }

    public function children()
    {
        return $this->hasMany(get_class($this), 'parent_id');
    }

    public function parent()
    {
        return $this->belongsTo(get_class($this), 'parent_id');
    }

}
