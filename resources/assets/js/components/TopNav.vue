<template lang="html">
  <div class="top-nav-wrap">
    <button type="button"
            class="btn btn-xs toggle-create-new-btn btn-primary"
            v-if="!showCreatingNewButtons"
            @click="toggleCreatingNewButtons"
    >
      <i class="fa fa-plus" aria-hidden="true"></i>
    </button>

    <create-new v-if="showCreatingNewButtons||creatingNew"></create-new>

    <breadcrumbs v-if="!showCreatingNewButtons"></breadcrumbs>

    <action-nav v-if="listingIsActionable"></action-nav>

  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

import CreateNew from './CreateNew.vue'
import Breadcrumbs from './Breadcrumbs.vue'
import ActionNav from './ActionNav.vue'

export default {
  name: 'top-nav',
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
  components: {
    CreateNew,
    Breadcrumbs,
    ActionNav
  }
}
</script>

<style lang="css">

</style>
