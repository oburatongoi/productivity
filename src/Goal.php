<?php

namespace Oburatongoi\Productivity;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Oburatongoi\Productivity\Traits\Fakable;

class Goal extends Model
{
    use SoftDeletes, Fakable;

    protected $dates = ['published_at', 'created_at', 'updated_at', 'deleted_at'];

}
