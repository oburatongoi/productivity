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

        $this->publishes([
            __DIR__.'/../../public/js' => public_path('vendor/productivity/js'),
            __DIR__.'/../../public/css' => public_path('vendor/productivity/css'),
            __DIR__.'/../../public/images' => public_path('vendor/productivity/images'),
            __DIR__.'/../../public/vendor' => public_path('vendor/productivity/css'),
            __DIR__.'/../config/fakeid.php' => config_path('fakeid.php'),
            __DIR__.'/../config/productivity.php' => config_path('productivity.php'),
            __DIR__.'/../config/javascript.php' => config_path('javascript.php'),
            __DIR__.'/../config/scout.php' => config_path('scout.php'),
            __DIR__.'/../database/migrations/' => database_path('migrations'),
            __DIR__.'/../Jobs' => app_path('Jobs'),
        ], 'productivity');

    }

    /**
     * Register the application services.
     *
     * @return void
     */
    public function register()
    {
        // Register productivity services
        $this->app->register('Oburatongoi\Productivity\Providers\AuthServiceProvider');
        $this->app->register('Oburatongoi\Productivity\Providers\RouteServiceProvider');

        // Register dependancies' services
        $this->app->register('Propaganistas\LaravelFakeId\FakeIdServiceProvider');
        $this->app->register('Laracasts\Utilities\JavaScript\JavaScriptServiceProvider');
        $this->app->register('Laravel\Scout\ScoutServiceProvider');
        $this->app->register('GeneaLabs\LaravelCaffeine\Providers\LaravelCaffeineService');
        // $this->app->register('Silber\Bouncer\BouncerServiceProvider');
        //
        // // Register dependancies' facades
        // $loader = \Illuminate\Foundation\AliasLoader::getInstance();
        // $loader->alias('Bouncer', 'Silber\Bouncer\BouncerFacade');
    }

}
