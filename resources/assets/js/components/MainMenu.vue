<template lang="html">

  <div class="main-menu">

    <div class="main-logo">
      <!-- <i class="fa fa-bars" aria-hidden="true"/> -->
        <a href="/">
            {{ logo }}
        </a>
    </div>

    <search/>

    <ul class="main-menu-options">

      <li class="menu-option">
          <a href="/">
            <i class="fa fa-fw fa-home" aria-hidden="true"/>
            Home
          </a>
      </li>

      <li class="menu-option">
        <button type="button" @click="toggleNestedOptions">
          <i class="fa fa-fw fa-inbox" aria-hidden="true"/>
          Browse
          <i class="fa" :class="showNestedOptionsClass" aria-hidden="true"/>
        </button>
      </li>

      <li v-if="showNestedOptions" class="nested-menu-options" :class="{open:showNestedOptions}">
        <ul>
          <li>
            <a href="/folders">
              <i class="fa fa-fw fa-folder" aria-hidden="true"/>
              Folders
            </a>
          </li>

          <li>
            <a href="/lists">
              <i class="fa fa-fw fa-list" aria-hidden="true"/>
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
  components: {
    Search
  },
  props: {
    logo: {
      type: String,
      default: 'Productivity'
    }
  },
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
}
</script>
