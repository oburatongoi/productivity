<?php

namespace Oburatongoi\Productivity;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Oburatongoi\Productivity\Traits\Fakable;
use Oburatongoi\Productivity\Traits\Listable;
use Oburatongoi\Productivity\Traits\Enfoldable;
use Oburatongoi\Productivity\Traits\Encryptable;
use Laravel\Scout\Searchable;
use App\Jobs\ReindexParentModels;
use App\Jobs\CascadeDelete;
use App\Jobs\CascadeRestore;

class Checklist extends Model
{
    use Encryptable, Enfoldable, Fakable, Listable, Searchable, SoftDeletes;

    protected $table = 'productivity_checklists';

    protected $encryptable = ['title', 'comments'];

    protected $dates = ['published_at', 'created_at', 'updated_at', 'deleted_at'];

    protected $fillable = [
      'fake_id', 'user_id', 'folder_id', 'parent_id', 'title', 'comments', 'list_type', 'visibility', 'published_at', 'created_at', 'updated_at', 'deleted_at',
    ];

    protected $casts = [
        'id' => 'integer',
        'reference_id' => 'integer',
        'is_checklist' => 'boolean',
        'has_deadlines' => 'boolean',
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
        return config('productivity.checklist_index_name', 'prod_CHECKLISTS');
    }

    /**
     * Get the indexable data array for the model.
     *
     * @return array
     */
    public function toSearchableArray()
    {
        $array = $this->toArray();

        $array['items'] = $this->items->map(function ($data) {
          return array_only($data->toArray(), ['id', 'content', 'comments', 'sections']);
        })->toArray();

        $array = array_only($array, ['id', 'title', 'fake_id', 'folder_id', 'items']);

        return $array;
    }

    public function owner()
    {
     return $this->belongsTo('App\User', 'user_id', 'id');
    }

    public function items()
    {
      return $this->hasMany('Oburatongoi\Productivity\ChecklistItem', 'checklist_id');
    }

    public function sections()
    {
        return $this->hasMany('Oburatongoi\Productivity\Checklist', 'parent_id');
    }

    public function getModelAttribute()
    {
      return $this->attributes['model'] = 'checklist';
    }

    protected $touches = ['folder'];
    protected static function boot() {
        parent::boot();
        static::deleting(function(Checklist $checklist) {
            if ($checklist->isForceDeleting()) {
                CascadeDelete::dispatch($checklist, true);
            } else {
                CascadeDelete::dispatch($checklist, false);
            }
        });
        static::restoring(function(Checklist $checklist) {
            CascadeRestore::dispatch($checklist);
        });
        static::saved(function(Checklist $checklist) {
          ReindexParentModels::dispatch($checklist);
        });
    }

}
