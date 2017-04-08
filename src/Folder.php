<?php

namespace Oburatongoi\Productivity;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Oburatongoi\Productivity\Traits\Fakable;
use Oburatongoi\Productivity\Traits\Nestable;
use Oburatongoi\Productivity\Traits\Encryptable;
use Oburatongoi\Productivity\Traits\Enfoldable;
use Laravel\Scout\Searchable;

class Folder extends Model
{
    use SoftDeletes, Nestable, Encryptable, Enfoldable, Fakable, Searchable;

    protected $table = 'productivity_folders';

    protected $encryptable = ['name', 'description'];

    protected $dates = ['published_at', 'created_at', 'updated_at', 'deleted_at'];

    protected $fillable = [
      'name', 'user_id', 'fake_id', 'description', 'published_at', 'created_at', 'updated_at', 'deleted_at', 'visibility',
    ];

    protected $casts = [
        'id' => 'integer',
        'user_id' => 'integer',
        'folder_id' => 'integer',
        'parent_model' => 'string',
        'fake_id' => 'integer',
        'description' => 'string',
        'visibility' => 'string',
    ];

    /**
     * Get the index name for the model.
     *
     * @return string
     */
    public function searchableAs()
    {
        // return env('FOLDER_INDEX_NAME', 'dev_FOLDERS');
        return config('productivity.folder_index_name', 'folders');
    }

    /**
     * Get the indexable data array for the model.
     *
     * @return array
     */
    public function toSearchableArray()
    {
        $array = $this->toArray();

        $array = array_only($array, ['id', 'name', 'fake_id', 'folder_id']);

        return $array;
    }

    public function owner()
    {
    return $this->belongsTo('App\User', 'user_id', 'id');
    }

    public function subfolders()
    {
        return $this->hasMany('Oburatongoi\Productivity\Folder', 'folder_id', 'id');
    }

    public function checklists()
    {
        return $this->hasMany('Oburatongoi\Productivity\Checklist');
    }

    protected $touches = ['folder'];
    protected static function boot() {
    parent::boot();
    static::deleting(function(Folder $folder) {
        if ($folder->isForceDeleting()) {
            $folder->subfolders()->forceDelete();
            $folder->checklists()->forceDelete();
        } else {
            $folder->subfolders()->delete();
            $folder->checklists()->delete();
        }
    });
    static::restoring(function(Folder $folder) {
        $folder->subfolders()->restore();
        $folder->checklists()->restore();
    });
  }
}
