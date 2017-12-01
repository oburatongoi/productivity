<?php

namespace Oburatongoi\Productivity;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Oburatongoi\Productivity\Traits\Encryptable;
use App\Jobs\ReindexParentModels;

class ChecklistItem extends Model
{
    use SoftDeletes, Encryptable;

    protected $table = 'productivity_checklist_items';

    protected $encryptable = ['content', 'comments'];

    protected $dates = ['published_at', 'checked_at', 'created_at', 'updated_at', 'deleted_at'];

    protected $fillable = [
        'checklist_id', 'fake_id', 'content', 'comments', 'deadline', 'is_urgent', 'is_important', 'checked_at', 'created_at', 'updated_at', 'deleted_at',
    ];

    protected $casts = [
        'id' => 'integer',
        'checklist_id' => 'integer',
        'content' => 'string',
        'description' => 'string',
        'deadline' => 'date',
    ];

    public function checklist()
    {
        return $this->belongsTo('Oburatongoi\Productivity\Checklist', 'checklist_id');
    }

    public function checklistById()
    {
        return $this->checklist()->where('id', $this->checklist_id)->first();
    }
    //
    // public function moveToChecklist(Checklist $checklist)
    // {
    //   //WIP: Validate that user is authorized to edit the item and the list
    //     return $this->checklist()->associate($checklist)->save();
    // }

    protected $touches = ['checklist'];
    protected static function boot() {
        parent::boot();
        static::saved(function(ChecklistItem $item) {
          ReindexParentModels::dispatch($item);
        });
    }

}
