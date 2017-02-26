<template lang="html">
  <div>
    <action-nav></action-nav>
    <index-all></index-all>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

import IndexAll from './IndexAll.vue'
import ActionNav from './ActionNav.vue'

export default {
    name: 'folder',
    components: {
        IndexAll,
        ActionNav
    },
    computed: {
      ...mapGetters([
        'currentFolder'
      ])
    }
}
</script>
