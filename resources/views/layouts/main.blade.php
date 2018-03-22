<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="_token" content="{{ csrf_token() }}">

        <title>{{ $title or 'Productivity' }}</title>

        <!-- Fonts -->
        {{-- <link href="https://fonts.googleapis.com/css?family=Raleway:100,300,600" rel="stylesheet" type="text/css"> --}}

        <link rel="stylesheet" href="https://pro.fontawesome.com/releases/v5.0.8/css/all.css" integrity="sha384-OGsxOZf8qnUumoWWSmTqXMPSNI9URpNYN35fXDb5Cv5jT6OR673ah1e5q+9xKTq6" crossorigin="anonymous">
        {{-- <link rel="stylesheet" href="/vendor/productivity/css/font-awesome-5.0.8/css/fontawesome-all.min.css"> --}}
        {{-- <link rel="stylesheet" href="/vendor/productivity/css/font-awesome-4.7.0/css/font-awesome.min.css"> --}}
        {{-- <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css"> --}}

        <link rel="stylesheet" href="/vendor/productivity/css/highlight-js/styles/tomorrow-night-blue.css">
        <script src="/vendor/productivity/css/highlight-js/highlight.pack.js"></script>
        {{-- <link rel="stylesheet" href="//cdn.jsdelivr.net/highlight.js/9.10.0/styles/tomorrow-night-blue.min.css"> --}}
        {{-- <script src="//cdn.jsdelivr.net/highlight.js/9.10.0/highlight.min.js"></script> --}}

        <!-- Quill text editor styles and JavaScript -->
        <script src="//cdn.quilljs.com/1.2.3/quill.min.js"></script>
        <link href="//cdn.quilljs.com/1.2.3/quill.snow.css" rel="stylesheet">

        <link rel="stylesheet" href="/vendor/productivity/css/productivity.css">
        {{-- <link rel="stylesheet" href="{{ mix('/vendor/productivity/css/productivity.css') }}"> --}}

        <script>
            window.Laravel =
            <?php echo json_encode([
                'csrfToken' => csrf_token(),
            ]); ?>
        </script>

        {{-- <!-- Hotjar Tracking Code for https://molly.io -->
        <script>
            (function(h,o,t,j,a,r){
                h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
                h._hjSettings={hjid:472704,hjsv:5};
                a=o.getElementsByTagName('head')[0];
                r=o.createElement('script');r.async=1;
                r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
                a.appendChild(r);
            })(window,document,'//static.hotjar.com/c/hotjar-','.js?sv=');
        </script> --}}
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

                <div class="wide-section" id="wide-section">
                    <div class="nav-sizer" id="wide-section-nav-sizer">
                        @include('productivity::partials._top_nav')
                    </div>

                    <div class="content-wrapper" id="content-wrapper">
                        @yield('content')
                        <search-results></search-results>
                        <notices></notices>
                    </div>
                </div>
            </div>
        </div>

        @include('productivity::javascript')

        <script src="/vendor/productivity/js/productivity.js"></script>
        {{-- <script src="{{ mix('/vendor/productivity/js/productivity.js') }}"></script> --}}
    </body>
</html>
