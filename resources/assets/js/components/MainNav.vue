<template lang="html">

  <div class="main-nav">
    <!-- <button type="button" class="btn btn-sm btn-primary" v-if="!showCreatingNewButtons" @click="toggleCreatingNewButtons">New</button> -->


    <ul class="nav nav-pills nav-stacked">

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

      <!-- <li :class="{active: selected=='home'}">
          <a href="/productivity">
              <i class="fa fa-fw fa-home" aria-hidden="true"></i>
              Home
          </a>
      </li>

      <li :class="{active: selected=='checklists'}">
          <a href="/productivity/lists">
              <i class="fa fa-fw fa-list" aria-hidden="true"></i>
              Lists
          </a>
      </li> -->
<!--
      <li :class="{active: selected=='notes'}">
          <a href="/productivity/notes">
              <i class="fa fa-fw fa-sticky-note" aria-hidden="true"></i>
              Notes
          </a>
      </li>

      <li :class="{active: selected=='goals'}">
          <a href="/productivity/goals">
              <i class="fa fa-fw fa-check-square" aria-hidden="true"></i>
              Goals
          </a>
      </li> -->
    </ul>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
    name: 'main-nav',
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
    }
}
</script>
