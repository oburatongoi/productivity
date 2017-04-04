<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title>{{ $title or 'Productivity' }}</title>

        <!-- Fonts -->
        <link href="https://fonts.googleapis.com/css?family=Raleway:100,300,600" rel="stylesheet" type="text/css">

        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css">

        {{-- <link rel="stylesheet" href="/vendor/productivity/css/font-awesome-4.7.0/css/font-awesome.min.css"> --}}
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
            <div class="section-wrapper">
                <div class="narrow-section main-menu-wrapper">
                    <div class="nav-sizer">
                        @yield('main-menu')
                    </div>
                    @include('productivity::partials._auth_links')
                </div>

                <div class="wide-section">
                    <div class="nav-sizer">
                        @include('productivity::partials._top_nav')
                    </div>

                    <div class="content-wrapper">
                        @yield('content')
                        <search-results></search-results>
                    </div>
                </div>
            </div>
        </div>

        @include('productivity::javascript')

        <script src="/vendor/productivity/js/productivity.js"></script>
    </body>
</html>
