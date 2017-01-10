<template lang="html">
    <ul class="nav nav-pills nav-stacked">
      <li :class="{active: selected=='home'}">
          <a href="/productivity">
              <i class="fa fa-fw fa-home" aria-hidden="true"></i>
              Home
          </a>
      </li>

      <li :class="{active: selected=='notes'}">
          <a href="/productivity/notes">
              <i class="fa fa-fw fa-sticky-note-o" aria-hidden="true"></i>
              Notes
          </a>
      </li>

      <li :class="{active: selected=='lists'}">
          <a href="/productivity/lists">
              <i class="fa fa-fw fa-list" aria-hidden="true"></i>
              Lists
          </a>
      </li>

      <li :class="{active: selected=='goals'}">
          <a href="/productivity/goals">
              <i class="fa fa-fw fa-check-square" aria-hidden="true"></i>
              Goals
          </a>
      </li>
    </ul>
</template>

<script>
export default {
    name: 'main-nav',
    props: ['selected'],

}
</script>
