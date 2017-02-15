<template lang="html">
  <div>
    <breadcrumbs model="folder" :resource="currentFolder"></breadcrumbs>
    <index-all></index-all>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

import IndexAll from './IndexAll.vue'
import Breadcrumbs from './Breadcrumbs.vue'

export default {
    name: 'folder',
    components: {
        IndexAll,
        Breadcrumbs
    },
    computed: {
      ...mapGetters([
        'currentFolder'
      ])
    }
}
</script>
