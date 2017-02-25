<?php namespace Oburatongoi\Productivity\Traits;

use Kalnoy\Nestedset\NodeTrait;

trait Nestable
{
    use NodeTrait;

    public function getLftName()
    {
        return 'lft';
    }

    public function getRgtName()
    {
        return 'rgt';
    }

    public function getParentIdName()
    {
        return 'folder_id';
    }

    // Specify parent id attribute mutator
    public function setParentAttribute($value)
    {
        $this->setParentIdAttribute($value);
    }

}
