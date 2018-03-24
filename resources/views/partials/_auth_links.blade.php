<ul class="auth-links">
  <li title="Log out of {{ Auth::user()->name }}'s account">
      <i class="fa fa-fw fa-power-off"
        aria-hidden="true"
        onclick="document.getElementById('logout-form').submit();"
        role="button"
      ></i>
      {{-- {{ Auth::user()->name }} --}}
      <form id="logout-form" action="{{ url('/logout') }}" method="POST" style="display: none;">
          {{ csrf_field() }}
      </form>
  </li>
</ul>
