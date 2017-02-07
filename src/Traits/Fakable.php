<?php

namespace Oburatongoi\Productivity\Traits;

use Propaganistas\LaravelFakeId\FakeIdTrait;

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
}
