<?php

namespace Oburatongoi\Productivity;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Oburatongoi\Productivity\Traits\Fakable;
use Oburatongoi\Productivity\Traits\Enfoldable;
use Oburatongoi\Productivity\Traits\Encryptable;
use Laravel\Scout\Searchable;

class Checklist extends Model
{
    use SoftDeletes, Fakable, Enfoldable, Encryptable, Searchable;

    protected $table = 'productivity_checklists';

    protected $encryptable = ['title', 'comments'];

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

    /**
     * Get the index name for the model.
     *
     * @return string
     */
    public function searchableAs()
    {
        return env('CHECKLIST_INDEX_NAME', 'dev_CHECKLISTS');
    }

    /**
     * Get the indexable data array for the model.
     *
     * @return array
     */
    public function toSearchableArray()
    {
        $array = $this->toArray();

        $array = array_only($array, ['id', 'title', 'fake_id']);

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

    protected static function boot() {
        parent::boot();
        static::deleting(function(Checklist $checklist) {
          $checklist->list_items()->delete();
        });
    }

}
