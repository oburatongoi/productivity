<?php

namespace Oburatongoi\Productivity\Providers;

use Illuminate\Support\ServiceProvider;

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
        $this->loadViewsFrom(__DIR__.'/../../resources/views', 'productivity');
        // $this->loadMigrationsFrom(__DIR__.'/../database/migrations');

        // $this->publishes([
        //     __DIR__.'/../../resources/views' => resource_path('views/vendor/productivity')
        // ], 'views');

        $this->publishes([
            __DIR__.'/../../public/js' => public_path('vendor/productivity/js'),
            __DIR__.'/../../public/css' => public_path('vendor/productivity/css'),
        ], 'public');

        $this->publishes([
            __DIR__.'/../database/migrations/' => database_path('migrations')
        ], 'migrations');

        $this->publishes([
            __DIR__.'/../config/fakeid.php' => config_path('fakeid.php'),
            __DIR__.'/../config/productivity.php' => config_path('productivity.php'),
            __DIR__.'/../config/javascript.php' => config_path('javascript.php'),
        ], 'config');

    }

    /**
     * Register the application services.
     *
     * @return void
     */
    public function register()
    {
        $this->app->register('Oburatongoi\Productivity\Providers\AuthServiceProvider');
        $this->app->register('Oburatongoi\Productivity\Providers\RouteServiceProvider');

        // $this->app->register('Baum\Providers\BaumServiceProvider');
        $this->app->register('Propaganistas\LaravelFakeId\FakeIdServiceProvider');
        $this->app->register('Laracasts\Utilities\JavaScript\JavaScriptServiceProvider');

        // $this->app->singleton('Kalnoy\Nestedset\NodeTrait', function($app) {
        //     return new \Kalnoy\Nestedset\NodeTrait;
        // });
    }

}
