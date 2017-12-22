<ul class="auth-links">
    <!-- Authentication Links -->
    @if (Auth::guest())
        <li><a href="{{ url('/login') }}">Login</a></li>
        <li><a href="{{ url('/register') }}">Register</a></li>
    @else
        <li>
            <i class="fa fa-fw fa-power-off"
              aria-hidden="true"
              onclick="document.getElementById('logout-form').submit();"
              role="button"
            ></i>
            {{ Auth::user()->name }}
            <form id="logout-form" action="{{ url('/logout') }}" method="POST" style="display: none;">
                {{ csrf_field() }}
            </form>
        </li>
    @endif
</ul>
