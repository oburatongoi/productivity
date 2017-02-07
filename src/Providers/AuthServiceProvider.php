<?php

namespace Oburatongoi\Productivity\Providers;

use Oburatongoi\Productivity\Folder;
use Oburatongoi\Productivity\Note;
use Oburatongoi\Productivity\Checklist;
use Oburatongoi\Productivity\ChecklistItem;
use Oburatongoi\Productivity\Goal;
use Oburatongoi\Productivity\Policies\FolderPolicy;
use Oburatongoi\Productivity\Policies\NotePolicy;
use Oburatongoi\Productivity\Policies\ChecklistPolicy;
use Oburatongoi\Productivity\Policies\ChecklistItemPolicy;
use Oburatongoi\Productivity\Policies\GoalPolicy;

use Illuminate\Support\Facades\Gate;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The policy mappings for the application.
     *
     * @var array
     */
    protected $policies = [
        Folder::class => FolderPolicy::class,
        Note::class => NotePolicy::class,
        Checklist::class => ChecklistPolicy::class,
        ChecklistItem::class => ChecklistItemPolicy::class,
        Goal::class => GoalPolicy::class,
    ];

    /**
     * Register any application authentication / authorization services.
     *
     * @return void
     */
    public function boot()
    {
        $this->registerPolicies();

        //
    }
}
