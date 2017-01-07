<?php

namespace Oburatongoi\Productivity;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Propaganistas\LaravelFakeId\FakeIdTrait;

class Goal extends Model
{
    use SoftDeletes;
    
    protected $dates = ['published_at', 'created_at', 'updated_at', 'deleted_at'];

    use FakeIdTrait;
}
