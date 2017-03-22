<?php

namespace Oburatongoi\Productivity\Traits;

use Propaganistas\LaravelFakeId\FakeIdTrait;
use Illuminate\Support\Facades\App;

trait Fakable
{
    use FakeIdTrait;

    public function getRouteKeyName()
    {
        return 'fake_id';
    }

    public function fakeID()
    {
        $this->fake_id = $this->getRouteKey();
        return $this->save();
    }

    protected static function bootFakable() {
        static::created(function($fakable) {
          $fakable->fakeID();
        });
    }

}
