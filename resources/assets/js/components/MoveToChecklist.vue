<template lang="html">
  <div class="move-to-checklist">
    <div class="move-to-checklist-heading">
      <i class="fa fa-arrow-left heading-left" aria-hidden="true" @click="selectFolder(currentFolder.folder)" v-if="currentFolder.folder"></i>
      <i class="fa fa-arrow-left heading-left" aria-hidden="true" @click="fetchInitialFoldersAndChecklists()" v-if="currentFolder.id&&!currentFolder.folder"></i>
      <span
        class="current-folder"
        v-if="currentFolder&&!addingFolder"
        :class="{ active: currentFolder.id==selectedChecklist.folder_id }"
        @click.prevent="resetSelectedChecklist"
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
          <button type="button" class="btn btn-default btn-sm" @click.prevent="toggleAddingFolder('false')">
            <i class="fa fa-fw fa-times" aria-hidden="true"></i>
          </button>
        </div>
      </form>

      <i class="fa fa-times heading-right" aria-hidden="true" @click="toggleMovable"></i>
    </div>

    <div class="move-to-checklist-body" @click.self="resetSelectedChecklist">
      <h4>Folders</h4>
      <div class="info-message" v-if="showFolderInfoMessage">
        <i class="fa fa-spinner fa-spin fa-lg" aria-hidden="true" v-if="isLoading"></i>
        <p :class="[folderInfoMessage.type]" v-if="folderInfoMessage.content&&folderInfoMessage.type">{{ folderInfoMessage.content }}</p>
      </div>

      <ul class="list-unstyled" v-if="folders&&!isLoading">
        <li class="nested-folder"
            v-for="folder in folders"
            @click.prevent="openFolder(folder)"
            @dblclick.prevent="openFolder(folder)"
        >
          <span>
            <i class="fa fa-fw fa-folder" aria-hidden="true"></i>
            {{folder.name}}
          </span>
          <i class="fa fa-angle-right" aria-hidden="true" @click="openFolder(folder)"></i>
        </li>
      </ul>

      <h4>Lists</h4>
      <div class="info-message" v-if="showChecklistInfoMessage">
        <i class="fa fa-spinner fa-spin fa-lg" aria-hidden="true" v-if="isLoading"></i>
        <p :class="[checklistInfoMessage.type]" v-if="checklistInfoMessage.content&&checklistInfoMessage.type">{{ checklistInfoMessage.content }}</p>
      </div>

      <ul class="list-unstyled" v-if="checklists&&!isLoading">
        <li class="nested-checklist"
            :class="{ active: checklist.id==selectedChecklist.id }"
            v-for="checklist in checklists"
            @click.prevent="highlightChecklist(checklist)"
            @dblclick.prevent="selectChecklist(checklist)"
        >
          <span>
            <i class="fa fa-fw fa-list" aria-hidden="true"></i>
            {{checklist.title}}
          </span>
          <i class="fa fa-angle-right" aria-hidden="true" @click="selectChecklist(checklist)"></i>
        </li>
      </ul>
    </div>

    <div class="move-to-checklist-footer">
      <template v-if="!isAlreadyInChecklist">
        <button type="button"
                class="btn btn-sm"
                :class="moveButtonClass"
                v-if="selectedChecklist.id"
                @click.prevent="moveTo(selectedChecklist)"
        >Move</button>
      </template>

      <button type="button"
              class="btn btn-sm btn-default"
              @click="cancel"
      >Cancel</button>

      <p v-if="footerText">
        <span v-if="!isAlreadyInChecklist">Move to</span>
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
  name: 'move-to-checklist',
  data () {
    return {
      addingFolder: false,
      currentFolder: Productivity.currentFolder ? Productivity.currentFolder : {},
      destinationFolder: {},
      folders: {},
      checklists: {},
      folderInfoMessage: { content: undefined, type: undefined },
      checklistInfoMessage: { content: undefined, type: undefined },
      isLoading: false,
      newFolder: { name: undefined },
      selectedChecklist: {}
    }
  },
  created: function() {
    this.fetchInitialFoldersAndChecklists(this.currentFolder.id)
  },
  methods: {
    ...mapActions([
      'delistChecklistItem',
      'deselectListing',
      'removeCurrentlyEditable',
      'storeFolder',
      'toggleMovable'
    ]),
    cancel: function() {
      return this.toggleMovable()
    },
    createNewFolder: function() {
      this.isLoading = true
      let folder = {
        name: this.newFolder.name,
        folder_id:this.currentFolder.id
      };

      this.storeFolder(folder).then(
        (response) => {
          this.toggleAddingFolder('false')
          this.fetchInitialFoldersAndChecklists(this.currentFolder.id)
        },
        (response) => {
          this.isLoading = false
          alert('Error creating folder')
        }
      )
    },
    fetchInitialFoldersAndChecklists: function(id = null) {
      this.isLoading = true
      axios.post('/fetch-initial-tree', {folder_id: id, includeChecklists: true})
           .then(
              (response) => {
                if (!id) this.currentFolder = {name: 'Home', id: null}
                this.refreshFolders(response.data.folders)
                this.refreshChecklists(response.data.checklists)
              }
            )
           .catch(
              (response) => this.setFolderInfoMessage('An error has occurred. Please refresh this page.', 'error')
            )
    },
    fetchNewFoldersAndChecklists: function(folder) {
      this.isLoading = true
      this.resetFolderInfoMessage()
      this.resetChecklistInfoMessage()
      this.resetSelectedChecklist()
      axios.post('/'+folder.fake_id+'/fetch-new-tree', {includeChecklists: true})
      .then(
        (response) => {
          this.refreshCurrentFolder(response.data.folder)
          this.refreshFolders(response.data.folder.subfolders)
          this.refreshChecklists(response.data.folder.checklists)
        }
      )
      .catch(
        (response) => this.setFolderInfoMessage('An error has occurred. Please refresh this page.', 'error')
      )
    },

    handleSuccessfulMove: function() {
      this.delistChecklistItem(this.selected.listing)
      this.deselectListing()
      this.removeCurrentlyEditable()
      this.toggleMovable()
    },
    highlightChecklist: function(checklist) {
      this.toggleAddingFolder('false')
      return checklist.id ? this.selectedChecklist = checklist : this.selectedChecklist = {}
    },
    moveTo: function(checklist) {
      axios.patch('/move-to-checklist/'+checklist.fake_id+'/item/'+this.selected.id)
      .then(
        (response) => response.data.child || response.data.input.child ? this.handleSuccessfulMove() : alert('No child returned')
      )
      .catch(
        (response) => response.data.child || response.data.input.child ? this.handleSuccessfulMove() : alert('Error moving '+this.selected.model)
      )
    },
    refreshFolders: function(freshFolders) {
      this.isLoading = false
      this.resetFolderInfoMessage()
      freshFolders ? this.folders = freshFolders : this.folders = {}
      if (_.isEmpty(freshFolders)) this.setFolderInfoMessage('This folder has no subfolders', 'info')
    },
    refreshChecklists: function(freshChecklists) {
      this.isLoading = false
      this.resetChecklistInfoMessage()
      freshChecklists ? this.checklists = freshChecklists : this.checklists = {}
      if (_.isEmpty(freshChecklists)) this.setChecklistInfoMessage('This folder has no lists', 'info')
    },
    refreshCurrentFolder: function(folder) {
      return folder.id ? this.currentFolder = folder : this.setFolderInfoMessage('The folder could not be retrieved', 'error')
    },
    resetSelectedChecklist: function() {
      return this.selectedChecklist = {}
    },
    resetFolderInfoMessage: function() {
      return this.folderInfoMessage = { content: undefined, type: undefined }
    },
    resetChecklistInfoMessage: function() {
      return this.checklistInfoMessage = { content: undefined, type: undefined }
    },
    openFolder: function(folder) {
      return this.fetchNewFoldersAndChecklists(folder)
    },
    selectFolder: function(folder) {
      return this.fetchNewFoldersAndChecklists(folder)
    },
    selectChecklist: function(checklist) {
      return this.selectedChecklist = checklist
    },
    setFolderInfoMessage: function(content, type) {
      return this.folderInfoMessage = { content:content, type:type }
    },
    setChecklistInfoMessage: function(content, type) {
      return this.checklistInfoMessage = { content:content, type:type }
    },
    toggleAddingFolder: function(boolean = null) {
      this.resetSelectedChecklist()
      return boolean && boolean === 'false' ? this.addingFolder = false : this.addingFolder = ! this.addingFolder
    }
  },
  computed: {
    ...mapGetters([
      'selected'
    ]),
    footerText: function() {
      return this.selectedChecklist.title && this.addingFolder ? 'Add to ' + this.selectedChecklist.title : this.isAlreadyInChecklist && ! this.selectedChecklist.id ? 'Please select a list' : this.isAlreadyInChecklist ? 'Item is already in this list' : this.selectedChecklist.title ? this.selectedChecklist.title : undefined
    },
    headerText: function() {
      return this.selectedChecklist && this.selectedChecklist.title ? this.selectedChecklist.title : 'Choose a list'
    },
    isAlreadyInChecklist: function() {
      return this.isInSelectedChecklist
    },
    isInSelectedChecklist: function() {
      return this.selectedChecklist.id && this.selected.listing.checklist_id && this.selectedChecklist.id == this.selected.listing.checklist_id ? true : false
    },
    showFolderInfoMessage: function() {
      return this.isLoading || this.folderInfoMessage.content && this.folderInfoMessage.type
    },
    showChecklistInfoMessage: function() {
      return this.isLoading || this.checklistInfoMessage.content && this.checklistInfoMessage.type
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
