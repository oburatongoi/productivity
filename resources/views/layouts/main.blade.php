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
                            @yield('breadcrumbs')
                            <ul class="nav navbar-nav navbar-right">
                                <!-- Authentication Links -->
                                @if (Auth::guest())
                                    <li><a href="{{ url('/login') }}">Login</a></li>
                                    <li><a href="{{ url('/register') }}">Register</a></li>
                                @else
                                    <li class="dropdown">
                                        <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false">
                                            {{ Auth::user()->name }} <span class="caret"></span>
                                        </a>

                                        <ul class="dropdown-menu" role="menu">
                                            <li>
                                                <a href="{{ url('/logout') }}"
                                                    onclick="event.preventDefault();
                                                             document.getElementById('logout-form').submit();">
                                                    Logout
                                                </a>

                                                <form id="logout-form" action="{{ url('/logout') }}" method="POST" style="display: none;">
                                                    {{ csrf_field() }}
                                                </form>
                                            </li>
                                        </ul>
                                    </li>
                                @endif
                            </ul>
                        </div>
                    </div>
                </div>
            </nav>

            @yield('action-nav')

            <div class="container content-wrapper">
                <div class="row">
                    <div class="col-md-2">
                        @yield('main-menu')
                    </div>
                    <div class="col-md-10 content">
                        @yield('content')
                    </div>
                </div>
            </div>
        </div>

        @include('productivity::javascript')

        <script src="/vendor/productivity/js/productivity.js"></script>
    </body>
</html>
