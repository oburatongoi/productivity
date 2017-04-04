<template lang="html">

  <nav class="main-menu">

    <div class="main-logo">
        <a href="/productivity">
            Productivity
        </a>
    </div>

    <search></search>

    <ul class="main-menu-nav">

      <li :class="{active: selected=='home'}">
          <a href="/productivity">
              <i class="fa fa-fw fa-home" aria-hidden="true"></i>
              Home
          </a>
      </li>

      <li role="presentation" class="dropdown">
        <a class="dropdown-toggle" data-toggle="dropdown" href="#" role="button" aria-haspopup="true" aria-expanded="false">
          <i class="fa fa-fw fa-inbox" aria-hidden="true"></i>
          Browse <span class="caret"></span>
        </a>

        <ul class="dropdown-menu">
          <li class="folder-color-scheme">
              <a href="/productivity/folders">
                  <i class="fa fa-fw fa-folder" aria-hidden="true"></i>
                  Folders
              </a>
          </li>

          <li class="list-color-scheme">
              <a href="/productivity/lists">
                  <i class="fa fa-fw fa-list" aria-hidden="true"></i>
                  Lists
              </a>
          </li>
        </ul>
      </li>
    </ul>
  </nav>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import Search from './Search.vue'

export default {
    name: 'main-menu',
    computed: {
      ...mapGetters([
        'showCreatingNewButtons',
        'selected'
      ])
    },
    methods: {
      ...mapActions([
        'toggleCreatingNewButtons'
      ])
    },
    components: {
      Search
    }
}
</script>
