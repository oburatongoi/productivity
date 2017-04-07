<template lang="html">

  <div class="main-menu">

    <div class="main-logo">
      <!-- <i class="fa fa-bars" aria-hidden="true"></i> -->
        <a href="/productivity">
            Productivity
        </a>
    </div>

    <search></search>

    <ul class="main-menu-options">

      <li class="menu-option">
          <a href="/productivity">
              <i class="fa fa-fw fa-home" aria-hidden="true"></i>
              Home
          </a>
      </li>

      <li class="menu-option">
        <button type="button" @click="toggleNestedOptions">
          <i class="fa fa-fw fa-inbox" aria-hidden="true"></i>
          Browse
          <i class="fa" :class="showNestedOptionsClass" aria-hidden="true"></i>
        </button>
      </li>

      <li v-if="showNestedOptions" class="nested-menu-options" :class="{open:showNestedOptions}">
        <ul>
          <li>
            <a href="/productivity/folders">
                <i class="fa fa-fw fa-folder" aria-hidden="true"></i>
                Folders
            </a>
          </li>

          <li>
            <a href="/productivity/lists">
                <i class="fa fa-fw fa-list" aria-hidden="true"></i>
                Lists
            </a>
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import Search from './Search.vue'

export default {
    name: 'main-menu',
    data () {
      return {
        showNestedOptions: false
      }
    },
    computed: {
      ...mapGetters([
        'showCreatingNewButtons',
        'selected'
      ]),
      showNestedOptionsClass: function() {
        return this.showNestedOptions ? 'fa-caret-up' : 'fa-caret-down'
      }
    },
    methods: {
      ...mapActions([
        'toggleCreatingNewButtons'
      ]),
      toggleNestedOptions: function() {
        this.showNestedOptions = ! this.showNestedOptions
      }
    },
    components: {
      Search
    }
}
</script>
