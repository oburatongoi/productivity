<?php

namespace Oburatongoi\Productivity;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Oburatongoi\Productivity\Traits\Encryptable;
use App\Jobs\ReindexParentModels;
use App\Jobs\CascadeDelete;
use App\Jobs\CascadeRestore;

class ChecklistItem extends Model
{
    use SoftDeletes, Encryptable;

    protected $table = 'productivity_checklist_items';

    protected $encryptable = [
      'content',
      'comments',
    ];

    protected $dates = [
      'published_at',
      'checked_at',
      'created_at',
      'updated_at',
      'deleted_at',
    ];

    protected $fillable = [
        'checklist_id',
        'parent_checklist_item_id',
        'child_list_item_type',
        'fake_id',
        'content',
        'comments',
        'deadline',
        'sort_order',
        'is_urgent',
        'is_important',
        'checked_at',
        'created_at',
        'updated_at',
        'deleted_at',
    ];

    protected $casts = [
        'id' => 'integer',
        'checklist_id' => 'integer',
        'content' => 'string',
        'description' => 'string',
        // 'deadline' => 'date',
    ];

    protected $with = ['child_list_items'];

    public function checklist()
    {
      if ($this->parent_checklist_item_id) {
        return $this->parent_list_item->checklist();
      }
      return $this->belongsTo('Oburatongoi\Productivity\Checklist', 'checklist_id');
    }

    public function child_list_items()
    {
        return $this->hasMany('Oburatongoi\Productivity\ChecklistItem', 'parent_checklist_item_id');
    }

    public function parent_list_item()
    {
        return $this->belongsTo('Oburatongoi\Productivity\ChecklistItem', 'parent_checklist_item_id');
    }

    protected $touches = [
      'checklist',
      'parent_list_item'
    ];

    protected static function boot() {
        parent::boot();

        static::deleting(function(ChecklistItem $item) {
            if ($item->isForceDeleting()) {
                CascadeDelete::dispatch($item, true);
            } else {
                CascadeDelete::dispatch($item, false);
            }
        });

        static::restoring(function(ChecklistItem $item) {
            CascadeRestore::dispatch($item);
        });

        static::saved(function(ChecklistItem $item) {
          ReindexParentModels::dispatch($item);
        });
    }

}
