<template>
  <div class="index-files">
    <h5>Lists</h5>
    <index-files></index-files>
    <move-to-folder v-if="selectedIsMovable"></move-to-folder>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import IndexFiles from './IndexFiles.vue'
import MoveToFolder from './MoveToFolder.vue'

export default {
    name: 'productivity-checklists',
    computed: {
      ...mapGetters([
        'selectedIsMovable'
      ])
    },
    components: {
      IndexFiles,
      MoveToFolder
    }
}
</script>
