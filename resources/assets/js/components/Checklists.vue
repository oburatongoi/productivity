<template>
  <div class="index-files">
    <h5>Lists</h5>
    <index-files/>
    <move-to-folder v-if="selectedIsMovable"/>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import IndexFiles from './IndexFiles.vue'
import MoveToFolder from './MoveToFolder.vue'

export default {
  name: 'productivity-checklists',
  components: {
    IndexFiles,
    MoveToFolder
  },
  computed: {
    ...mapGetters([
      'selectedIsMovable'
    ])
  },
}
</script>
