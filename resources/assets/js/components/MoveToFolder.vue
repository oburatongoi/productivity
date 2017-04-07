<template lang="html">
  <div class="move-to-folder">
    <div class="move-to-folder-heading">
      <i class="fa fa-arrow-left heading-left" aria-hidden="true" @click="selectFolder(currentFolder.folder)" v-if="currentFolder.folder"></i>
      <i class="fa fa-arrow-left heading-left" aria-hidden="true" @click="fetchInitialFolders()" v-if="currentFolder.id&&!currentFolder.folder"></i>
      <span
        class="current-folder"
        v-if="currentFolder&&!addingFolder"
        :class="{ active: currentFolder.id==selectedFolder.id }"
        @click.prevent="highlightFolder(currentFolder)"
      >
        <i class="fa fa-home" aria-hidden="true" v-if="!currentFolder.id&&!currentFolder.folder"></i>
        {{currentFolder.name}}
      </span>

      <form class="form-horizontal add-folder-form" v-if="addingFolder" @submit.prevent="createNewFolder">
        <div class="add-folder-form-input">
          <input type="text" class="form-control input-sm" v-model="newFolder.name" placeholder="New Folder Name" maxlength="255">
        </div>
        <div class="add-folder-form-buttons">
          <button type="submit" class="btn btn-primary btn-sm">
            <i class="fa fa-fw fa-check" aria-hidden="true"></i>
          </button>
          <button type="button" class="btn btn-default btn-sm" @click.prevent="toggleAddingFolder">
            <i class="fa fa-fw fa-times" aria-hidden="true"></i>
          </button>
        </div>
      </form>

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
          <span>
            <i class="fa fa-fw fa-folder" aria-hidden="true" v-if="folder.id!==selectedFolder.id"></i>
            <i class="fa fa-fw fa-folder-open" aria-hidden="true" v-if="folder.id==selectedFolder.id"></i>
            {{folder.name}}
          </span>
          <i class="fa fa-angle-right" aria-hidden="true" @click="selectFolder(folder)"></i>
        </li>
      </ul>
    </div>

    <div class="move-to-folder-footer">
      <template v-if="!isAlreadyInFolder&&!isCurrentFolder">
        <button type="button"
                class="btn btn-sm"
                :class="moveButtonClass"
                v-if="selectedFolder.id"
                @click.prevent="moveTo(selectedFolder)"
        >Move</button>
        <button type="button"
                class="btn btn-sm"
                :class="moveButtonClass"
                v-if="!selectedFolder.id&&currentFolder.id"
                @click.prevent="moveTo(currentFolder)"
        >Move Here</button>
        <button type="button"
                class="btn btn-sm"
                :class="moveButtonClass"
                v-if="!selectedFolder.id&&currentFolder.name=='Home'"
                @click.prevent="moveToHome()"
        >Move</button>
      </template>

      <button type="button"
              class="btn btn-sm btn-default"
              @click="cancel"
      >Cancel</button>

      <p v-if="footerText">
        <span v-if="!isCurrentFolder&&!isAlreadyInFolder">Move to</span>
        <span class="footer-text"> {{footerText}}</span>
      </p>

      <span class="fa-stack toggle-add-folder-btn" @click="toggleAddingFolder">
        <i class="fa fa-folder fa-stack-2x folder-color-scheme"></i>
        <i class="fa fa-plus fa-stack-1x fa-inverse" v-if="!addingFolder"></i>
        <i class="fa fa-times fa-stack-1x fa-inverse" v-if="addingFolder"></i>
      </span>
    </div>
  </div>

</template>

<script>

import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'move-to-folder',
  data () {
    return {
      addingFolder: false,
      currentFolder: Productivity.currentFolder ? Productivity.currentFolder : {},
      destinationFolder: {},
      folders: {},
      infoMessage: { content: undefined, type: undefined },
      isLoading: false,
      newFolder: { name: undefined },
      selectedFolder: {}
    }
  },
  created: function() {
    this.fetchInitialFolders(this.currentFolder.id)
  },
  methods: {
    ...mapActions([
      'delistChecklist',
      'delistFolder',
      'storeFolder',
      'deselectListing',
      'toggleMovable'
    ]),
    cancel: function() {
      this.toggleMovable()
      return this.deselectListing()
    },
    createNewFolder: function() {
      this.isLoading = true
      let folder = {
        name: this.newFolder.name,
        folder_id:this.currentFolder.id
      };

      this.storeFolder(folder).then(
        (response) => {
          this.folders.unshift(response.folder)
          this.isLoading = false
          this.toggleAddingFolder('false')
        },
        (response) => {
          this.isLoading = false
          alert('Error creating folder')
        }
      )
    },
    fetchInitialFolders: function(id = null) {
      this.isLoading = true
      axios.post('/fetch-initial-tree', {folder_id: id})
           .then(
              (response) => {
                if (!id) this.currentFolder = {name: 'Home', id: null}
                this.refreshFolders(response.data.folders)
              }
            )
           .catch(
              (response) => this.setInfoMessage('An error has occurred. Please refresh this page.', 'error')
            )
    },
    fetchNewFolders: function(folder) {
      this.isLoading = true
      this.resetInfoMessage()
      this.resetSelectedFolder()
      axios.post('/'+folder.fake_id+'/fetch-new-tree')
      .then(
        (response) => {
          this.refreshCurrentFolder(response.data.folder)
          this.refreshFolders(response.data.folder.subfolders)
        }
      )
      .catch(
        (response) => this.setInfoMessage('An error has occurred. Please refresh this page.', 'error')
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
    highlightFolder: function(folder) {
      this.toggleAddingFolder('false')
      return folder.id ? this.selectedFolder = folder : this.selectedFolder = {}
    },
    moveTo: function(folder) {
      axios.patch('/move-to/'+folder.fake_id, { child:this.selected })
      .then(
        (response) => response.data.child ? this.handleSuccessfulMove() : alert('No child returned')
      )
      .catch(
        (response) => alert('Error moving '+this.selected.model)
      )
    },
    moveToHome: function(folder) {
      axios.patch('/move-to-home/', { child:this.selected })
      .then(
        (response) => response.data.child ? this.handleSuccessfulMove() : alert('No child returned')
      )
      .catch(
        (response) => alert('Error moving '+this.selected.model)
      )
    },
    refreshFolders: function(freshFolders) {
      this.isLoading = false
      freshFolders ? this.folders = freshFolders : this.folders = {}
      if (!freshFolders.length) this.setInfoMessage('This folder has no subfolders', 'info')
    },
    refreshCurrentFolder: function(folder) {
      return folder.id ? this.currentFolder = folder : this.setInfoMessage('The folder could not be retrieved', 'error')
    },
    resetSelectedFolder: function() {
      return this.selectedFolder = {}
    },
    resetInfoMessage: function() {
      return this.infoMessage = { content: undefined, type: undefined }
    },
    selectFolder: function(folder) {
      return this.fetchNewFolders(folder)
    },
    setInfoMessage: function(content, type) {
      return this.infoMessage = { content:content, type:type }
    },
    toggleAddingFolder: function(boolean = null) {
      this.resetSelectedFolder()
      return boolean && boolean === 'false' ? this.addingFolder = false : this.addingFolder = ! this.addingFolder
    }
  },
  computed: {
    ...mapGetters([
      'selected'
    ]),
    currentFolderIsSelected: function() {
      return this.currentFolder.id && this.selectedFolder.id && this.currentFolder.id == this.selectedFolder.id
    },
    footerText: function() {
      return this.currentFolder.name && this.addingFolder ? 'Add to ' + this.currentFolder.name : this.isCurrentFolder ? 'Cannot move a folder into itself' : this.isAlreadyInFolder && ! this.selectedFolder.id ? 'Please select a folder' : this.isAlreadyInFolder ? 'Item is already in this folder' : this.selectedFolder.name ? this.selectedFolder.name : this.currentFolder.name ?  this.currentFolder.name : undefined
    },
    headerText: function() {
      return this.currentFolder.name ? this.currentFolder.name : 'Choose a folder'
    },
    isAlreadyInFolder: function() {
      return this.isInSelectedFolder || ! this.selectedFolder.id && this.isInCurrentFolder
    },
    isCurrentFolder: function() {
      return this.selected.model == 'folder' && (this.selected.listing.id == this.currentFolder.id || this.selected.listing.id == this.selectedFolder.id)
    },
    isInCurrentFolder: function() {
      return this.currentFolder.id && this.selected.listing.folder_id && this.currentFolder.id == this.selected.listing.folder_id ? true : false
    },
    isInSelectedFolder: function() {
      return this.selectedFolder.id && this.selected.listing.folder_id && this.selectedFolder.id == this.selected.listing.folder_id ? true : false
    },
    showInfoMessage: function() {
      return this.isLoading || this.infoMessage.content && this.infoMessage.type
    },
    moveButtonClass: function() {
      switch (this.selected.model) {
        case 'checklist': return 'btn-list'
          break;
        default: return 'btn-folder'

      }
    }
  }
}
</script>

<style lang="css">
</style>
