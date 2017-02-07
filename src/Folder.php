<?php

namespace Oburatongoi\Productivity;

use Illuminate\Database\Eloquent\SoftDeletes;
use Oburatongoi\Productivity\Traits\Fakable;
use Baum\Node;

class Folder extends Node
{
    use SoftDeletes, Fakable;

    protected $dates = ['published_at', 'created_at', 'updated_at', 'deleted_at'];

    protected $fillable = [
      'name', 'user_id', 'fake_id', 'description', 'published_at', 'created_at', 'updated_at', 'deleted_at', 'visibility',
    ];

    protected $casts = [
        'id' => 'integer',
        'user_id' => 'integer',
        'parent_id' => 'integer',
        'parent_model' => 'string',
        'fake_id' => 'integer',
        'description' => 'string',
        'visibility' => 'string',
    ];

    public function owner()
    {
    return $this->belongsTo('App\User', 'user_id', 'id');
    }

    public function parent()
    {
        return $this->belongsTo('Oburatongoi\Productivity\Folder', 'parent_id', 'id');
    }

    public function subfolders()
    {
        return $this->hasMany('Oburatongoi\Productivity\Folder', 'parent_id', 'id');
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

    // public function teammates()
    // {
    //     return $this->belongsToMany('App\User', 'folder_user', 'reference_id', 'user_id');
    // }

    protected $touches = ['parent'];
    protected static function boot() {
    parent::boot();
    static::deleting(function(Folder $folder) {
        $folder->subfolders()->delete();
        $folder->notes()->delete();
        $folder->checklists()->delete();
        // $folder->teammates()->delete();
    });
  }
}
