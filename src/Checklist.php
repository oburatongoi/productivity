<?php

namespace Oburatongoi\Productivity;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Oburatongoi\Productivity\Traits\Fakable;

class Checklist extends Model
{
    use SoftDeletes, Fakable;

    protected $table = 'productivity_checklists';

    protected $dates = ['published_at', 'created_at', 'updated_at', 'deleted_at'];

    protected $fillable = [
      'fake_id', 'user_id', 'folder_id', 'title', 'comments', 'visibility', 'published_at', 'created_at', 'updated_at', 'deleted_at',
    ];

    protected $touches = ['folder'];

    protected $casts = [
        'id' => 'integer',
        'reference_id' => 'integer',
        'is_checklist' => 'boolean',
        'has_deadlines' => 'boolean',
    ];

    public function owner()
    {
     return $this->belongsTo('App\User', 'user_id', 'id');
    }

    public function folder()
    {
      return $this->belongsTo('Oburatongoi\Productivity\Folder', 'folder_id');
    }

    public function folderById()
    {
        return $this->folder()->where('id', $this->folder_id)->first();
    }

    public function items()
    {
      return $this->hasMany('Oburatongoi\Productivity\ChecklistItem', 'checklist_id');
    }

    protected static function boot() {
        parent::boot();
        static::deleting(function(Checklist $checklist) {
          $checklist->list_items()->delete();
        });
    }

}
