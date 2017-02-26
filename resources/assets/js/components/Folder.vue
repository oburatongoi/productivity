<template lang="html">
  <div>
    <action-nav></action-nav>
    <index-all></index-all>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

import IndexAll from './IndexAll.vue'

export default {
    name: 'folder',
    components: {
        IndexAll
    },
    computed: {
      ...mapGetters([
        'currentFolder'
      ])
    }
}
</script>
