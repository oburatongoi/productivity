<template lang="html">
  <div>
    <index-all></index-all>
    <move-to-folder v-if="selectedIsMovable"></move-to-folder>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import IndexAll from './IndexAll.vue'
import MoveToFolder from './MoveToFolder.vue'

export default {
  name: 'folder',
  computed: {
    ...mapGetters([
      'selectedIsMovable'
    ])
  },
  components: {
    IndexAll,
    MoveToFolder
  }
}
</script>
