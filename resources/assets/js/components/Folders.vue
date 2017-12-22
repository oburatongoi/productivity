<template lang="html">
  <div>
    <index-all/>
    <move-to-folder v-if="selectedIsMovable"/>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import IndexAll from './IndexAll.vue'
import MoveToFolder from './MoveToFolder.vue'

export default {
  name: 'folders',
  components: {
    IndexAll,
    MoveToFolder
  },
  computed: {
    ...mapGetters([
      'selectedIsMovable'
    ])
  },
}
</script>
