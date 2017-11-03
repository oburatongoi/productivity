## Productivity

## Installation
Compatible with Laravel 5. To install, run:

`$ composer install oburatongoi/productivity`.

Next, add the service provider to the provider array in the `app/config.app` file:

`Oburatongoi\Productivity\Providers\ProductivityServiceProvider::class,`


In your .env file, add the following variables:

`SESSION_DOMAIN=.your-domain.com` Note the `'.'` before the domain name.

`PRODUCTIVITY_LOGO=logo-text` defaults to 'Productivity'

`PRODUCTIVITY_DOMAIN=your-domain.com`

`PRODUCTIVITY_SUBDOMAIN=productivity`

If using Scout with Algolia, set the following environment variables

`FOLDER_INDEX_NAME=the-name-of-your-folder-index` defaults to  `prod_FOLDERS`

`CHECKLIST_INDEX_NAME=the-name-of-your-folder-index` defaults to  `prod_CHECKLISTS`

Be sure to update your DNS 'A' or 'CNAME' settings to include the new name and add SSL encryption for your desired subdomain if you do not have wildcard subdomain encryption.

Next, publish the package's views, migrations and routes:

`$ php artisan vendor:publish`

You will need to force publish the productivity config. Note that this will add or overwrite the following files in the config folder: productivity.php, fakeid.php and javascript.php:

`php artisan vendor:publish --tag=productivity --force`

Next, add the Productive trait to your app's User model:

```php
use Oburatongoi\Productivity\Traits\Productive;


class User extends Authenticatable
{
    use Notifiable, Productive;

    // ... User class methods
}
```

To properly address certain exceptions, add the following to your `app\Exceptions\Handler.php` file:

```php
use Illuminate\Session\TokenMismatchException as TokenMismatchException;
use AlgoliaSearch\AlgoliaException as AlgoliaException;

use Bugsnag;

class Handler extends ExceptionHandler
{
    /**
     * A list of the exception types that should not be reported.
     *
     * @var array
     */
    protected $dontReport = [
        \Illuminate\Session\TokenMismatchException::class,
        \AlgoliaSearch\AlgoliaException::class,
    ];

    /**
     * Report or log an exception.
     *
     * This is a great spot to send exceptions to Sentry, Bugsnag, etc.
     *
     * @param  \Exception  $exception
     * @return void
     */
    public function report(Exception $exception)
    {
        Bugsnag::notifyException($exception);
        parent::report($exception);
    }

    /**
     * Render an exception into an HTTP response.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Exception  $exception
     * @return \Illuminate\Http\Response
     */
    public function render($request, Exception $exception)
    {

        if ($exception instanceof TokenMismatchException) {
            Bugsnag::notifyException($exception);

            if ($request->expectsJson()) return response()->json([
                'tokenMismatch' => true,
                'input' => $request->except(['password']),
                'url' => $request->fullUrl(),
                'method' => $request->method(),
                'token' => csrf_token()
            ]);
        }

        if ($exception instanceof AlgoliaException) {
            Bugsnag::notifyException($exception);

            if ($request->expectsJson()) return response()->json([
                'algoliaException' => true,
                'input' => $request->except(['password'])
            ]);
        }

        return parent::render($request, $exception);
    }

```

Finally, run the migration to add productivity's folders to the database. Note that productivity's tables all have the productivity_ prefix, so make sure you don't have any naming conflicts in your database:

`$ php artisan migrate`

## Getting Started

When adding Productivity to a fresh Laravel installation, consider doing the following:
* Change app name in config/app
* Install Bugsnag
* Install and Configure Algolia
* Install and Configure Redis
