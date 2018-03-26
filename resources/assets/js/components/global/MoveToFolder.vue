<template lang="html">
  <div class="move-to-folder" id="move-to-folder">
    <div class="move-to-folder-heading">
      <i class="far fa-arrow-left heading-left" aria-hidden="true" @click="selectFolder(currentFolder.folder)" v-if="currentFolder.folder"/>
      <i class="far fa-arrow-left heading-left" aria-hidden="true" @click="fetchInitialFolders()" v-if="currentFolder.id&&!currentFolder.folder"/>
      <span
        class="current-folder"
        v-if="currentFolder&&!addingFolder"
        :class="{ active: currentFolder.id==selectedFolder.id }"
        @click.prevent="highlightFolder(currentFolder)"
      >
        <i class="fas fa-home" aria-hidden="true" v-if="!currentFolder.id&&!currentFolder.folder"/>
        {{ currentFolder.name }}
      </span>

      <form class="form-horizontal add-folder-form" v-if="addingFolder" @submit.prevent="createNewFolder" autocomplete="off">
        <div class="add-folder-form-input">
          <input type="text" class="form-control input-sm" v-focus v-model="newFolder.name" placeholder="New Folder Name" maxlength="255">
        </div>
        <div class="add-folder-form-buttons">
          <button type="submit" class="btn btn-primary btn-sm">
            <i class="far fa-fw fa-check" aria-hidden="true"/>
          </button>
          <button type="button" class="btn btn-default btn-sm" @click.prevent="toggleAddingFolder('false')">
            <i class="far fa-fw fa-times" aria-hidden="true"/>
          </button>
        </div>
      </form>

      <i class="far fa-times heading-right" aria-hidden="true" @click="toggleMovable"/>
    </div>

    <div class="move-to-folder-body" @click.self="highlightFolder(currentFolder)">
      <div class="info-message" v-if="showInfoMessage">
        <i class="far fa-spinner fa-spin fa-lg" aria-hidden="true" v-if="isLoading"/>
        <p :class="[infoMessage.type]" v-if="infoMessage.content&&infoMessage.type">{{ infoMessage.content }}</p>
      </div>

      <ul class="list-unstyled" v-if="folders&&!isLoading">
        <li v-if="isStoringFolder">
          <i class="far fa-spinner fa-spin fa-lg" aria-hidden="true"/>
        </li>
        <li class="nested-folder"
            :class="{ active: folder.id==selectedFolder.id }"
            v-for="folder in folders"
            @click.prevent="highlightFolder(folder)"
            @dblclick.prevent="selectFolder(folder)"
            :key="folder.id"
        >
          <span>
            <i class="fas fa-fw fa-folder" aria-hidden="true" v-if="folder.id!==selectedFolder.id"/>
            <i class="fas fa-fw fa-folder-open" aria-hidden="true" v-if="folder.id==selectedFolder.id"/>
            {{ folder.name }}
          </span>
          <i class="far fa-angle-right" aria-hidden="true" @click="selectFolder(folder)"/>
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
        <span class="footer-text"> {{ footerText }}</span>
      </p>

      <span class="fa-layers fa-fw toggle-add-folder-btn" @click="toggleAddingFolder">
        <i class="fas fa-folder folder-color-scheme"/>
        <i class="far fa-plus fa-inverse" data-fa-transform="shrink-6 left-5" v-if="!addingFolder"/>
        <i class="far fa-times fa-inverse" data-fa-transform="shrink-6 left-5" v-if="addingFolder"/>
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
      folders: [],
      infoMessage: { content: undefined, type: undefined },
      isLoading: false,
      isStoringFolder: false,
      newFolder: { name: undefined },
      selectedFolder: {}
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
      return this.isInSelectedFolder || ! this.selectedFolder.id && this.isOnlyChildOfCurrentFolder
    },
    isCurrentFolder: function() {
      return this.selected.folders.length == 1 && this.selected.folders.indexOf(this.currentFolder) !== -1 || this.selected.folders.indexOf(this.selectedFolder) !== -1
    },
    checklistIsOnlyChildOfCurrentFolder: function() {
      return this.currentFolder.id && this.selected.checklists.length == 1 && this.selected.checklists[0].folder_id == this.currentFolder.id ? true : false
    },
    folderIsOnlyChildOfCurrentFolder: function() {
      return this.currentFolder.id && this.selected.folders.length == 1 && this.selected.folders[0].parent_id == this.currentFolder.id ? true : false
    },
    isOnlyChildOfCurrentFolder: function() {
      return this.folderIsOnlyChildOfCurrentFolder || this.checklistIsOnlyChildOfCurrentFolder ? true : false
    },
    isInSelectedFolder: function() {
      return this.selectedFolder && this.selected.folders.indexOf(this.selectedFolder) !== -1 ? true : false
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
  },
  created: function() {
    this.fetchInitialFolders(this.currentFolder.id)
  },
  methods: {
    ...mapActions([
      'clearSelected',
      'delistChecklist',
      'delistFolder',
      'storeFolder',
      'deselect',
      'toggleMovable'
    ]),
    cancel: function() {
      this.toggleMovable()
      return this.deselect()
    },
    createNewFolder: function() {
      this.isStoringFolder = true
      let folder = {
        name: this.newFolder.name,
        folder_id:this.currentFolder.id
      };

      this.storeFolder(folder).then(
        (response) => {
          this.handleSuccessfulFolderCreation(response)
        },
        (response) => {
          this.isStoringFolder = false
          if (response.name) {
            this.handleSuccessfulFolderCreation(response)
          } else {
            alert('Error creating folder')
          }
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
      .then( response => {
        this.refreshCurrentFolder(response.data.folder)
        this.refreshFolders(response.data.folder.subfolders)
      })
      .catch( error => this.setInfoMessage('An error has occurred. Please refresh this page.', 'error') )
    },
    handleSuccessfulFolderCreation: function(folder) {
      this.toggleAddingFolder('false')
      this.isStoringFolder = false
      this.folders.unshift(folder)
    },
    handleSuccessfulMove: function() {
      // WIP: iterate through response and delete only ones that match selected array

      for (var i = 0; i < this.selected.folders.length; i++) {
        this.delistFolder(this.selected.folders[i])
      }

      for (var i = 0; i < this.selected.checklists.length; i++) {
        this.delistChecklist(this.selected.checklists[i])
      }
      this.clearSelected()
    },
    highlightFolder: function(folder) {
      this.toggleAddingFolder('false')
      return folder.id ? this.selectedFolder = folder : this.selectedFolder = {}
    },
    moveTo: function(folder) {
      axios.patch('/move-to-folder/'+folder.fake_id, { selected:this.selected }).then(
        (response) => response.data.success ? this.handleSuccessfulMove() : alert('Error moving selected item(s)')
      ).catch(
        (response) => response.data.success ? this.handleSuccessfulMove() : alert('WIP: handle error at moveToFolder')
      )
    },
    moveToHome: function(folder) {
      axios.patch('/move-to-home/', { selected:this.selected }).then(
        (response) => response.data.success ? this.handleSuccessfulMove() : alert('Error moving selected item(s)')
      ).catch(
        (response) => response.data.success ? this.handleSuccessfulMove() : alert('WIP: handle error at moveToHome')
      )
    },
    refreshFolders: function(freshFolders) {
      this.isLoading = false
      this.resetInfoMessage()
      freshFolders ? this.folders = freshFolders : this.folders = {}
      if (_.isEmpty(freshFolders)) this.setInfoMessage('This folder has no subfolders', 'info')
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
}
</script>

<style lang="scss">
.move-to-folder {
    position: fixed;
    background: white;
    border: 1px solid $base-border-color;
    border-radius: 3px;
    padding: 0;

    @media(max-width:767px){
        top: 10%;
        left: 5%;
        right: 5%;
    }
    @media(min-width:768px){
        top: 10%;
        left: 15%;
        right: 15%;
    }
    @media(min-width:992px){
        top: 10%;
        left: 30%;
        right: 30%;
    }
    @media(min-width:1200px){
        top: 10%;
        left: 30%;
        right: 30%;
    }

    .move-to-folder-heading {
        background: $body-bg;
        border-bottom: 1px solid $base-border-color;
        padding: 10px;
        text-align: left;
        .fa-times,
        .fa-arrow-left {
            cursor: pointer;
            &:hover {
                color: $folder-primary;
            }
        }
        .heading-right {
            float: right;
            margin-top: 5px;
        }
        .heading-left {
            float: left;
            margin-top: 5px;
        }
        &:after {
            content: "";
            display: block;
            clear: both;
        }
        .current-folder {
            margin-left: 10px;
            font-size: 1.2em;
            cursor: default;
            &.active {
                color: $folder-primary
            }
        }
        .add-folder-form {
            display: inline-block;
            width: 90%;
            margin: 0;
            margin-left: 10px;

            .add-folder-form-input {
                width: 70%;
                display: inline-block;
            }
            .add-folder-form-buttons {
                width: 28%;
                display: inline-block;
            }
        }

    }
    .move-to-folder-body {
        height: 200px;
        overflow-y: scroll;
        overflow-x: hidden;
        padding: 10px 10px 10px 30px;
        position: relative;
        .info-message {
            .fa-spin {
                color: $folder-primary;
            }
            .error {
                color: $brand-warning;
            }
            .info {
                color: $brand-info;
            }
        }
        .nested-folder {
            display: block;
            padding: 5px 5px 0px;
            border-radius: 3px;
            cursor: default;
            .fa-angle-right {
                float: right;
                cursor: pointer;
                padding: 3px 8px;
                border: 1px solid transparent;
                display: none;
                &:hover {
                    border: 1px solid;
                    border-radius: 3px;
                }
            }
            .far, .fas, .fal {
                color: $folder-primary;
            }
            &.active {
                color: $folder-primary;
                border: 1px dotted $folder-primary;
            }
            &:hover {
                background: lighten($body-bg, 0.5%);
                .fa-angle-right {
                    display: inline-block;
                }
            }
            span {
                display: inline-block;
                width: 93%;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                margin: 0;
                padding: 0;
                line-height: 1.5;
            }

        }
    }
    .move-to-folder-footer {
        border-top: 1px solid $base-border-color;
        padding: 10px;
        p {
            margin: 0;
            margin-left: 10px;
            font-size: 0.8em;
            display: inline-block;
            span.footer-text {
                color: $folder-primary;
                font-weight: $font-weight-bold;
            }
        }
        .toggle-add-folder-btn {
            float: right;
            cursor: pointer;
            margin-top: 8px;
            // .fa-folder {
            //     font-size: 1.5em;
            //     line-height: 16px;
            // }
            // .fa-times,
            // .fa-plus {
            //     font-size: 0.7em;
            //     line-height: 18px;
            // }
            .fa-times,
            .fa-plus {
                color: white;
            }
        }
    }
}

</style>
