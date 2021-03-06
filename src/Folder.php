<?php

namespace Oburatongoi\Productivity;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Oburatongoi\Productivity\Traits\Fakable;
use Oburatongoi\Productivity\Traits\Nestable;
use Oburatongoi\Productivity\Traits\Encryptable;
use Oburatongoi\Productivity\Traits\Enfoldable;
use App\Jobs\ReindexParentModels;
use App\Jobs\CascadeDelete;
use App\Jobs\CascadeRestore;
use Laravel\Scout\Searchable;

class Folder extends Model
{
    use Encryptable, Enfoldable, Fakable, Nestable, Searchable, SoftDeletes;

    protected $table = 'productivity_folders';

    protected $encryptable = ['name', 'description'];

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

    /**
     * The accessors to append to the model's array form.
     *
     * @var array
     */
    protected $appends = ['model'];

    /**
     * Get the index name for the model.
     *
     * @return string
     */
    public function searchableAs()
    {
        return config('productivity.folder_index_name', 'prod_FOLDERS');
    }

    /**
     * Get the indexable data array for the model.
     *
     * @return array
     */
    public function toSearchableArray()
    {
        $array = $this->toArray();

        $array['checklists'] = $this->checklists->map(function ($data) {
          return array_only($data->toArray(), ['id', 'title']);
        })->toArray();

        $array['items'] = $this->items->map(function ($data) {
          return array_only($data->toArray(), ['id', 'content', 'comments', 'subfolders']);
        })->toArray();

        $array = array_only($array, ['id', 'name', 'fake_id', 'parent_id', 'checklists', 'items']);

        return $array;
    }

    public function owner()
    {
    return $this->belongsTo('App\User', 'user_id', 'id');
    }

    public function subfolders()
    {
        return $this->hasMany('Oburatongoi\Productivity\Folder', 'parent_id', 'id');
    }

    public function checklists()
    {
        return $this->hasMany('Oburatongoi\Productivity\Checklist');
    }

    public function items()
    {
        return $this->hasManyThrough('Oburatongoi\Productivity\ChecklistItem', 'Oburatongoi\Productivity\Checklist');
    }

    public function getModelAttribute()
    {
      return $this->attributes['model'] = 'folder';
    }

    protected $touches = ['folder'];
    protected static function boot() {
    parent::boot();
    static::saved(function(Folder $folder) {
      ReindexParentModels::dispatch($folder);
    });
    static::deleting(function(Folder $folder) {
        if ($folder->isForceDeleting()) {
          CascadeDelete::dispatch($folder, true);
        } else {
          CascadeDelete::dispatch($folder, false);
        }
    });
    static::restoring(function(Folder $folder) {
        CascadeRestore::dispatch($folder);
    });
  }
}
