<?php

namespace Oburatongoi\Productivity;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Propaganistas\LaravelFakeId\FakeIdTrait;

class Note extends Model
{
    use SoftDeletes;
    use FakeIdTrait;

  protected $dates = ['published_at', 'created_at', 'updated_at', 'deleted_at'];

  protected $fillable = [
      'fake_id', 'user_id', 'folder_id', 'title', 'content', 'visibility', 'published_at', 'created_at', 'updated_at', 'deleted_at',
  ];

  protected $touches = ['folder'];

  public function owner()
  {
      return $this->belongsTo('App\User', 'user_id', 'id');
  }

  public function folder()
  {
      return $this->belongsTo('App\Folder', 'folder_id');
  }
}
