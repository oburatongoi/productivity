<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        {{-- <meta name="csrf-token" content="{{ csrf_token() }}"> --}}

        <title>Productivity</title>

        <!-- Fonts -->
        <link href="https://fonts.googleapis.com/css?family=Raleway:100,600" rel="stylesheet" type="text/css">

        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css">

        <link rel="stylesheet" href="/vendor/productivity/css/productivity.css">

        <script>
            window.Laravel =
            <?php echo json_encode([
                'csrfToken' => csrf_token(),
            ]);
            ?>
        </script>


    </head>
    <body>
        <div id="productivity-app">
            <nav class="navbar navbar-default">
                <div class="container">
                    <div class="row">
                        <div class="col-md-2">
                            <div class="navbar-header">
                                <a class="navbar-brand" href="/productivity">
                                    Productivity
                                </a>
                            </div>
                        </div>
                        <div class="col-md-10">
                            <create-new></create-new>
                        </div>
                    </div>
                </div>

            </nav>
            <div class="container">
                <div class="row">
                    <div class="col-md-2">
                        @yield('main-menu')
                    </div>
                    <div class="col-md-10">
                        @yield('content')
                    </div>
                </div>
            </div>
        </div>

        @include('productivity::javascript')

        <script src="/vendor/productivity/js/productivity.js"></script>
    </body>
</html>
