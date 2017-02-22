<?php

namespace Oburatongoi\Productivity;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Oburatongoi\Productivity\Traits\Fakable;
use Oburatongoi\Productivity\Traits\Enfoldable;
use Oburatongoi\Productivity\Traits\Encryptable;

class Goal extends Model
{
    use SoftDeletes, Fakable, Enfoldable, Encryptable;

    protected $table = 'productivity_goals';

    protected $encryptable = [];

    protected $dates = ['published_at', 'created_at', 'updated_at', 'deleted_at'];

}
