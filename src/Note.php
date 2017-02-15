<?php

namespace Oburatongoi\Productivity;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Oburatongoi\Productivity\Traits\Fakable;
use Oburatongoi\Productivity\Traits\Enfoldable;

class Note extends Model
{

    use SoftDeletes, Fakable, Enfoldable;

    protected $table = 'productivity_notes';

    protected $dates = ['published_at', 'created_at', 'updated_at', 'deleted_at'];

    protected $fillable = [
      'fake_id', 'user_id', 'folder_id', 'title', 'content', 'visibility', 'published_at', 'created_at', 'updated_at', 'deleted_at',
    ];

    protected $touches = ['folder'];

    public function owner()
    {
      return $this->belongsTo('App\User', 'user_id', 'id');
    }

}
