<template lang="html">
  <div class="top-nav-wrap">
    <button type="button"
            class="btn btn-xs toggle-create-new-btn btn-primary"
            v-if="!showCreatingNewButtons"
            @click="toggleCreatingNewButtons"
    >
      <i class="fa fa-plus" aria-hidden="true"/>
    </button>

    <create-new v-if="showCreatingNewButtons||creatingNew"/>

    <breadcrumbs v-if="!showCreatingNewButtons" :current-view="currentView"/>

    <action-nav v-if="listingIsActionable"/>

  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

import CreateNew from './CreateNew.vue'
import Breadcrumbs from './Breadcrumbs.vue'
import ActionNav from './ActionNav.vue'

export default {
  name: 'top-nav',
  components: {
    CreateNew,
    Breadcrumbs,
    ActionNav
  },
  props: {
    currentView: {
      type: String,
      default: null
    }
  },
  computed: {
    ...mapGetters([
      'showCreatingNewButtons',
      'creatingNew',
      'listingIsActionable'
    ])
  },
  methods: {
    ...mapActions([
      'toggleCreatingNewButtons'
    ])
  },

}
</script>

<style lang="css">

</style>
