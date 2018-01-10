<?php

namespace Oburatongoi\Productivity;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Oburatongoi\Productivity\Traits\Encryptable;
use Oburatongoi\Productivity\Traits\Listable;
use App\Jobs\ReindexParentModels;
use App\Jobs\CascadeDelete;
use App\Jobs\CascadeRestore;

class ChecklistItem extends Model
{
    use Encryptable, Listable, SoftDeletes;

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
        'parent_id',
        'sub_list_type',
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

    protected $with = ['children'];

    // public function checklist()
    // {
    //   if ($this->parent_id) {
    //     return $this->parent->checklist();
    //   }
    //   return $this->belongsTo('Oburatongoi\Productivity\Checklist', 'checklist_id');
    // }

    // public function children()
    // {
    //     return $this->hasMany('Oburatongoi\Productivity\ChecklistItem', 'parent_id');
    // }
    //
    // public function parent()
    // {
    //     return $this->belongsTo('Oburatongoi\Productivity\ChecklistItem', 'parent_id');
    // }

    protected $touches = [
      'checklist',
      'parent'
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
