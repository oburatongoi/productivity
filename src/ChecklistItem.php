<?php

namespace Oburatongoi\Productivity;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ChecklistItem extends Model
{
    use SoftDeletes;

    protected $dates = ['published_at', 'checked_at', 'created_at', 'updated_at', 'deleted_at'];

    protected $fillable = [
        'checklist_id', 'fake_id', 'content', 'comments', 'deadline', 'is_urgent', 'is_important', 'checked_at', 'created_at', 'updated_at', 'deleted_at',
    ];

    protected $touches = ['checklist'];

    protected $casts = [
        'id' => 'integer',
        'checklist_id' => 'integer',
        'content' => 'string',
        'description' => 'string',
        'deadline' => 'date',
    ];

    public function checklist()
    {
        return $this->belongsTo('Oburatongoi\Productivity\Checklist');
    }
}
