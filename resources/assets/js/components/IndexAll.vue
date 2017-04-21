<template lang="html">
  <div class="index-all" @click.self="deselectListing">
    <div class="index-folders" v-if="hasFolders" @click.self="deselectListing">
      <h5>Folders</h5>
      <index-folders></index-folders>
    </div>

    <div class="index-files" v-if="hasFiles" @click.self="deselectListing">
      <h5>Files</h5>
      <index-files></index-files>
    </div>

    <p class="notice" v-if="isEmpty">No Files or Folders have been added yet.</p>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import IndexFolders from './IndexFolders.vue'
import IndexFiles from './IndexFiles.vue'

export default {
  name: 'index-all',
  methods: {
    ...mapActions([
      'selectListing',
      'deselectListing'
    ])
  },
  computed: {
    ...mapGetters([
      'user',
      'folders',
      'checklists',
      'selected',
      'selectedIsMovable'
    ]),
    hasFolders: function() {
      return this.folders && ! _.isEmpty(this.folders)
    },
    hasFiles: function() {
      return this.checklists && ! _.isEmpty(this.checklists)
    },
    isEmpty: function() {
      return ! this.hasFolders && ! this.hasFiles
    }
  },
  components: {
    IndexFolders,
    IndexFiles
  }
}
</script>
