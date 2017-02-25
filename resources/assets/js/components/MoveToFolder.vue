<template lang="html">
  <div class="move-to-folder">
    <div class="move-to-folder-heading">
      <i class="fa fa-arrow-left heading-left" aria-hidden="true" @click="selectFolder(currentFolder.folder)" v-if="currentFolder.folder"></i>
      <i class="fa fa-arrow-left heading-left" aria-hidden="true" @click="fetchInitialFolders()" v-if="currentFolder.id&&!currentFolder.folder"></i>
      <span
        class="current-folder"
        v-if="currentFolder"
        :class="{ active: currentFolder.id==selectedFolder.id }"
        @click.prevent="highlightFolder(currentFolder)"
      >
        <i class="fa fa-home" aria-hidden="true" v-if="!currentFolder.id&&!currentFolder.folder"></i>
        {{currentFolder.name}}
      </span>
      <i class="fa fa-times heading-right" aria-hidden="true" @click="toggleMovable"></i>
    </div>

    <div class="move-to-folder-body" @click.self="highlightFolder(currentFolder)">
      <div class="info-message" v-if="showInfoMessage">
        <i class="fa fa-spinner fa-spin fa-lg" aria-hidden="true" v-if="isLoading"></i>
        <p :class="[infoMessage.type]" v-if="infoMessage.content&&infoMessage.type">{{ infoMessage.content }}</p>
      </div>

      <ul class="list-unstyled" v-if="folders&&!isLoading">
        <li class="nested-folder"
            :class="{ active: folder.id==selectedFolder.id }"
            v-for="folder in folders"
            @click.prevent="highlightFolder(folder)"
            @dblclick.prevent="selectFolder(folder)"
        >
          <i class="fa fa-fw fa-folder" aria-hidden="true" v-if="folder.id!==selectedFolder.id"></i>
          <i class="fa fa-fw fa-folder-open" aria-hidden="true" v-if="folder.id==selectedFolder.id"></i>
          {{folder.name}}
          <i class="fa fa-angle-right" aria-hidden="true" @click="selectFolder(folder)"></i>
        </li>
      </ul>
    </div>

    <div class="move-to-folder-footer">
      <template v-if="!isAlreadyInFolder&&!isCurrentFolder">
        <button type="button"
                class="btn btn-xs btn-primary"
                v-if="selectedFolder.id"
                @click.prevent="moveTo(selectedFolder)"
        >Move</button>
        <button type="button"
                class="btn btn-xs btn-primary"
                v-if="!selectedFolder.id&&currentFolder.id"
                @click.prevent="moveTo(currentFolder)"
        >Move Here</button>
        <button type="button"
                class="btn btn-xs btn-primary"
                v-if="!selectedFolder.id&&currentFolder.name=='Home'"
                @click.prevent="moveToHome()"
        >Move</button>
      </template>

      <button type="button"
              class="btn btn-xs btn-default"
              @click="toggleMovable"
      >Cancel</button>

      <p v-if="footerText">
        <span v-if="!isCurrentFolder&&!isAlreadyInFolder">Move to</span>
        <span class="footer-text"> {{footerText}}</span>
      </p>
    </div>
  </div>

</template>

<script>

import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'move-to-folder',
  data () {
    return {
      folders: {},
      selectedFolder: {},
      destinationFolder: {},
      currentFolder: Productivity.currentFolder ? Productivity.currentFolder : {},
      isLoading: false,
      infoMessage: {
        content: undefined,
        type: undefined
      }
    }
  },
  created: function() {
    this.fetchInitialFolders(this.currentFolder.id)
  },
  methods: {
    ...mapActions([
      'toggleMovable',
      'delistFolder',
      'delistChecklist'
    ]),
    fetchInitialFolders: function(id = null) {
      this.isLoading = true
      this.$http.post('/productivity/fetch-initial-tree', {folder_id: id}).then(
        (response) => {
          if (!id) this.currentFolder = {name: 'Home', id: null}
          this.refreshFolders(response.data.folders)
        },
        (response) => this.setInfoMessage('An error has occurred. Please refresh this page.', 'error')
      )
    },
    fetchNewFolders: function(folder) {
      this.isLoading = true
      this.resetInfoMessage()
      this.$http.post('/productivity/'+folder.fake_id+'/fetch-new-tree').then(
        (response) => {
          response.data.folder ? this.currentFolder = response.data.folder : this.setInfoMessage('The folder could not be retrieved', 'error')
          this.refreshFolders(response.data.folder.subfolders)
        },
        (response) => this.setInfoMessage('An error has occurred. Please refresh this page.', 'error')
      )
    },
    refreshFolders: function(freshFolders) {
      this.isLoading = false
      freshFolders ? this.folders = freshFolders : this.folders = {}
      if (!freshFolders.length) this.setInfoMessage('This folder has no subfolders', 'info')
    },
    highlightFolder: function(folder) {
      return folder.id ? this.selectedFolder = folder : this.selectedFolder = {}
    },
    selectFolder: function(folder) {
      return this.fetchNewFolders(folder)
    },
    moveTo: function(folder) {
      this.$http.patch('/productivity/move-to/'+folder.fake_id, { child:this.selected }).then(
        (response) => response.data.child ? this.handleSuccessfulMove() : alert('No child returned'),
        (response) => alert('Error moving '+this.selected.model)
      )
    },
    moveToHome: function(folder) {
      this.$http.patch('/productivity/move-to-home/', { child:this.selected }).then(
        (response) => response.data.child ? this.handleSuccessfulMove() : alert('No child returned'),
        (response) => alert('Error moving '+this.selected.model)
      )
    },
    handleSuccessfulMove: function() {
      switch (this.selected.model) {
        case 'folder': this.delistFolder(this.selected.listing)
          break;
        case 'checklist': this.delistChecklist(this.selected.listing)
          break;
        default: console.log('Could not find selected model');
      }
      this.toggleMovable()
    },
    setInfoMessage: function(content, type) {
      return this.infoMessage = { content:content, type:type }
    },
    resetInfoMessage: function() {
      return this.infoMessage = { content: undefined, type: undefined }
    }
  },
  computed: {
    ...mapGetters([
      'selected'
    ]),
    headerText: function() {
      return this.currentFolder.name ? this.currentFolder.name : 'Choose a folder'
    },
    footerText: function() {
      return this.isCurrentFolder ? 'Cannot move a folder into itself' : this.isAlreadyInFolder && ! this.selectedFolder.id ? 'Please select a folder' : this.isAlreadyInFolder ? 'Item is already in this folder' : this.selectedFolder.name ? this.selectedFolder.name : this.currentFolder.name ?  this.currentFolder.name : undefined
    },
    showInfoMessage: function() {
      return this.isLoading || this.infoMessage.content && this.infoMessage.type
    },
    isAlreadyInFolder: function() {
      return this.isInSelectedFolder || ! this.selectedFolder.id && this.isInCurrentFolder
    },
    isInCurrentFolder: function() {
      return this.currentFolder.id && this.selected.listing.folder_id && this.currentFolder.id == this.selected.listing.folder_id ? true : false
    },
    isInSelectedFolder: function() {
      return this.selectedFolder.id && this.selected.listing.folder_id && this.selectedFolder.id == this.selected.listing.folder_id ? true : false
    },
    isCurrentFolder: function() {
      return this.selected.model == 'folder' && (this.selected.listing.id == this.currentFolder.id || this.selected.listing.id == this.selectedFolder.id)
    },
    currentFolderIsSelected: function() {
      return this.currentFolder.id && this.selectedFolder.id && this.currentFolder.id == this.selectedFolder.id
    }
  }
}
</script>

<style lang="css">
</style>
