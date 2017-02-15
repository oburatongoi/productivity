## Productivity

## Installation
Compatible with Laravel 5. To install, run:

`$ composer install oburatongoi/productivity`.

Next, add the service provider to the provider array in the `app/config.app` file:

`Oburatongoi\Productivity\Providers\ProductivityServiceProvider::class,`

Next, publish the package's views, migrations and routes:

`$ php artisan vendor:publish`

Finally, run the migration to add productivity's folders to the database. Note that productivity's tables all have the productivity_ prefix, so make sure you don't have any naming conflicts in your database:

`$ php artisan migrate`

## Getting Started

TBD
