<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title>Productivity</title>

        <!-- Fonts -->
        <link href="https://fonts.googleapis.com/css?family=Raleway:100,600" rel="stylesheet" type="text/css">

        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css">

        <link rel="stylesheet" href="/vendor/productivity/css/productivity.css">

    </head>
    <body>
        <div id="productivity-app">
            <div class="container">
                <div class="row">
                    <div class="col-md-2">
                        @yield('main-menu')
                    </div>
                    <div class="col-md-8">
                        <h5 class="text-capitalize">{{ $model or 'Productivity'}}</h5>
                        @yield('content')
                    </div>
                </div>
            </div>
        </div>

        <script src="/vendor/productivity/js/productivity.js"></script>
    </body>
</html>
