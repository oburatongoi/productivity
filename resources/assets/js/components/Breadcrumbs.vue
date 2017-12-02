<template lang="html">
  <div class="productivity-breadcrumbs">
    <ul class="list-unstyled">
      <li>
        <a href="/">
          <i class="fa fa-fw fa-home" aria-hidden="true"></i>
          Home
        </a>
      </li>
      <li v-if="ancestors.length" v-for="ancestor in ancestors" :class="{ 'current-folder': checklist&&checklist.folder_id==ancestor.id }">
        <i class="fa fa-fw fa-angle-right" aria-hidden="true"></i>
        <a :href="'/folders/'+ancestor.fake_id">
          <i class="fa fa-fw fa-folder-o" aria-hidden="true"></i>
          {{ancestor.name}}
        </a>
      </li>

      <li v-if="currentFolder&&currentFolder.name&&!hasCurrentView&&!currentFolderIsAncestor" class="current-folder">
          <i class="fa fa-fw fa-angle-right" aria-hidden="true"></i>
          <i class="fa fa-fw fa-folder-open" aria-hidden="true"></i>
          {{currentFolder.name}}
      </li>

      <!-- this section renders the name of the current view of the Home screen -->
      <li v-if="hasCurrentView" class="current-view">
        <template v-if="currentView=='foldersIndex'">
          <i class="fa fa-fw fa-angle-right" aria-hidden="true"></i>
          <i class="fa fa-fw fa-folder-o" aria-hidden="true"></i>
          Folders
        </template>
        <template v-if="currentView=='checklistsIndex'">
          <i class="fa fa-fw fa-angle-right" aria-hidden="true"></i>
          <i class="fa fa-fw fa-list" aria-hidden="true"></i>
          Lists
        </template>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'breadcrumbs',
  props: ['currentView'],
  computed: {
    ...mapGetters([
      'currentFolder',
      'ancestors',
      'checklist'
    ]),
    currentFolderIsAncestor: function() {
      return this.ancestors.length && this.currentFolder ? _.findIndex(this.ancestors, ['id', this.currentFolder.id]) !== -1 : false;
    },
    hasCurrentView: function() {
      return ! _.isEmpty(this.currentView)
    }
  }
}
</script>
