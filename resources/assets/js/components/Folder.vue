<template lang="html">
  <div>
    <h4>{{currentFolder.name}}</h4>
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
