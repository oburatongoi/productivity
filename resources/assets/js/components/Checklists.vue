<template>
  <div class="index-files">
    <h5>Lists</h5>
    <index-files/>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import IndexFiles from './IndexFiles.vue'


export default {
  name: 'productivity-checklists',
  components: {
    IndexFiles,
  },
}
</script>
