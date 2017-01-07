<?php

namespace Oburatongoi\Productivity\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Route;

class ProductivityServiceProvider extends ServiceProvider
{
    /**
     * Bootstrap the application services.
     *
     * @return void
     */
    public function boot()
    {
        $this->loadRoutesFrom(__DIR__.'/../routes/web.php');
        $this->loadViewsFrom(__DIR__.'/../resources/views', 'productivity');
        $this->loadMigrationsFrom(__DIR__.'/../database/migrations');

        $this->defineRoutes();

        $this->publishes([
            __DIR__.'/../resources/views' => resource_path('views/vendor/productivity')
        ], 'views');

        $this->publishes([
            __DIR__.'/../database/migrations/' => database_path('migrations')
        ], 'migrations');

        $this->publishes([
            __DIR__.'/../config/productivity.php' => config_path('productivity.php')
        ], 'config');
    }

    /**
     * Register the application services.
     *
     * @return void
     */
    public function register()
    {
        $this->app->register('Propaganistas\LaravelFakeId\FakeIdServiceProvider');
        $this->app->register('Baum\Providers\BaumServiceProvider');
    }

    /**
     * Define the Package's routes.
     *
     * @return void
     */
    protected function defineRoutes()
    {
        $this->defineFakeIdBindings();
        // If the routes have not been cached, we will include them in a route group
        // so that all of the routes will be conveniently registered to the given
        // controller namespace. After that we will load the Spark routes file.
        if (! $this->app->routesAreCached()) {
            Route::group([
                'namespace' => 'Oburatongoi\Productivity\Http\Controllers'],
                function ($router) {
                    require __DIR__.'/../Http/routes.php';
                }
            );
        }
    }

    protected function defineFakeIdBindings()
    {
        Route::fakeIdModel('folder', 'Oburatongoi\Productivity\Folder');
        Route::fakeIdModel('list', 'Oburatongoi\Productivity\List');
        Route::fakeIdModel('note', 'Oburatongoi\Productivity\Note');
        Route::fakeIdModel('goal', 'Oburatongoi\Productivity\Goal');
    }
}
