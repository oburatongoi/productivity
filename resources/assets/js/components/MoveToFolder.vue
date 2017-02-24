<template lang="html">
  <div class="move-to-folder">
    <div class="move-to-folder-heading">
      <i class="fa fa-arrow-left heading-left" aria-hidden="true" @click="selectFolder(currentFolder.folder)" v-if="currentFolder.folder"></i>
      <span
        class="current-folder"
        v-if="currentFolder"
        :class="{ active: currentFolder.id==selectedFolder.id }"
        @click.prevent="highlightFolder(currentFolder)"
      >
        {{currentFolder.name}}
      </span>
      <i class="fa fa-times heading-right" aria-hidden="true" @click="close"></i>
    </div>
    <div class="move-to-folder-body" @click.self="highlightFolder(currentFolder)">
      <ul class="list-unstyled">
        <li
          class="nested-folder"
          :class="{ active: folder.id==selectedFolder.id }"
          v-for="folder in folders"
          @click.prevent="highlightFolder(folder)"
          @dblclick.prevent="selectFolder(folder)"
        >
          <i class="fa fa-fw fa-folder" aria-hidden="true" v-if="folder.id!==selectedFolder.id"></i>
          <i class="fa fa-fw fa-folder-open" aria-hidden="true" v-if="folder.id==selectedFolder.id"></i>
          {{folder.name}}
        </li>
      </ul>
    </div>
    <div class="move-to-folder-footer">
      <button type="button" class="btn btn-xs btn-primary" v-if="selectedFolder.id" @click.prevent="moveTo(selectedFolder)">Move</button>
      <button type="button" class="btn btn-xs btn-primary" v-if="!selectedFolder.id&&currentFolder.id" @click.prevent="moveTo(currentFolder)">Move Here</button>
      <p v-if="footerText"> Move to <span>{{footerText}}</span></p>
    </div>
  </div>

</template>

<script>
export default {
  name: 'move-to-folder',
  props: {
    selected: Object
  },
  data () {
    return {
      currentFolder: Productivity.currentFolder ? Productivity.currentFolder : {},
      folders: {},
      selectedFolder: {}
    }
  },
  created: function() {
    this.fetchInitialFolders()
    console.log(this.currentFolder);
  },
  methods: {
    fetchInitialFolders: function() {
      this.$http.post('/productivity/fetch-initial-tree', {folder_id: this.currentFolder.id}).then(
        (response) => response.data.folders && response.data.folders.length ? this.refreshFolders(response.data.folders) : alert('No folders returned'),
        (response) => alert('Error retrieving folders')
      )
    },
    fetchNewFolders: function(folder) {
      this.$http.post('/productivity/'+folder.fake_id+'/fetch-new-tree').then(
        (response) => {
          response.data.folder ? this.currentFolder = response.data.folder : alert('No Folder returned')
          this.refreshFolders(response.data.folder.subfolders)
        },
        (response) => alert('Error retrieving folders')
      )
    },
    refreshFolders: function(freshFolders) {
      this.folders = freshFolders
    },
    highlightFolder: function(folder) {
      return this.selectedFolder.id !== folder.id ? this.selectedFolder = folder : this.selectedFolder = {}
    },
    selectFolder: function(folder) {
      this.currentFolder = folder
      return this.fetchNewFolders(folder)
    },
    moveTo: function(folder) {
      alert('WIP: Move to ' + folder.name)
    },
    close: function() {
      this.$emit('close')
    }
  },
  computed: {
    headerText: function() {
      return this.currentFolder.name ? this.currentFolder.name : 'Choose a folder'
    },
    footerText: function() {
      return this.selectedFolder.name ? this.selectedFolder.name : this.currentFolder.name ?  this.currentFolder.name : undefined
    },
    folderClass: function() {

    }
  }
}
</script>

<style lang="css">
</style>
