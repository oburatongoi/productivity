<template lang="html">
  <div class="move-to-checklist">
    <div class="move-to-checklist-heading">
      <template>
        <i class="fa fa-arrow-left heading-left" aria-hidden="true" @click="openFolder(currentFolder.folder)" v-if="currentFolder.folder"/>
        <i class="fa fa-arrow-left heading-left" aria-hidden="true" @click="fetchInitialFoldersAndChecklists()" v-if="currentFolder.id&&!currentFolder.folder"/>
        <span
          class="current-folder"
          v-if="currentFolder"
          :class="{ active: currentFolder.id==selectedChecklist.folder_id }"
          @click.prevent="resetSelected"
        >
          <i class="fa fa-home" aria-hidden="true" v-if="!currentFolder.id&&!currentFolder.folder"/>
          {{ currentFolder.name }}
        </span>
      </template>

      <span class="heading-right" @click="toggleMovable">
        <i class="fa fa-times" aria-hidden="true"/>
        Cancel Move
      </span>

    </div>

    <div class="move-to-checklist-body" @click.self="resetSelected">
      <div class="movable-selected-items">
        <h6>Move the following list items: </h6>
        <span v-for="item in selected.checklistItems" :key="item.id">
          <i class="fa fa-fw fa-times"
            aria-hidden="true"
            v-if="selected.checklistItems.length > 1"
            @click="removeItem({ model: 'checklist-item', listing: item, preserveState: true })"/>
          <i class="fa fa-fw fa-square-o" aria-hidden="true"/>
          {{ item.content }}
        </span>
      </div>

      <span @click="toggleAddingFolder" v-if="!addingFolder">
        <span class="fa-stack toggle-add-folder-btn">
          <i class="fa fa-folder fa-stack-2x folder-color-scheme"/>
          <i class="fa fa-plus fa-stack-1x fa-inverse"/>
        </span>
        <span v-if="!addingFolder">Add Folder</span>
      </span>

      <form class="form-horizontal add-folder-form" v-if="addingFolder" @submit.prevent="createNewFolder">
        <div class="add-folder-form-input">
          <input type="text" class="form-control input-sm" v-focus v-model="newFolder.name" placeholder="New Folder Name" maxlength="255">
        </div>
        <div class="add-folder-form-buttons">
          <button type="submit" class="btn btn-primary btn-sm">
            <i class="fa fa-fw fa-plus" aria-hidden="true"/>
            Add
          </button>
          <button type="button" class="btn btn-default btn-sm" @click.prevent="toggleAddingFolder('false')">
            <i class="fa fa-fw fa-times" aria-hidden="true"/>
            Cancel
          </button>
        </div>
      </form>

      <template>
        <move-target-folders
          :folders="folders"
          :is-loading="isLoading"
          :folder-info-message="folderInfoMessage"
          :is-storing-folder="isStoringFolder"
        />

        <move-target-checklists
          :checklists="checklists"
          :checklist-items="checklistItems"
          :is-loading="isLoading"
          :checklist-info-message="checklistInfoMessage"
          :checklist-item-info-message="checklistItemInfoMessage"
          :is-storing-checklist="isStoringChecklist"
          :selected-checklist-id="selectedChecklist.id"
          :selected-checklist-item="selectedChecklistItem"
          :open-checklist-id="openChecklistId"
        />
      </template>
    </div>

    <div class="move-to-checklist-footer">
      <template v-if="!isInSelectedChecklist&&!isSelectedChecklist">
        <button type="button"
          class="btn btn-sm"
          :class="moveButtonClass"
          v-if="selectedChecklist.id||selectedChecklistItem.id"
          @click.prevent="moveTo"
        >Move</button>
      </template>

      <button type="button"
              class="btn btn-sm btn-default"
              @click="cancel"
      >Cancel</button>

      <p v-if="footerText">
        <span v-if="!isInSelectedChecklist&&!isSelectedChecklist">Move to</span>
        <span class="footer-text"> {{ footerText }}</span>
      </p>

      <!-- <span class="fa-stack toggle-add-folder-btn" @click="toggleAddingFolder">
        <i class="fa fa-folder fa-stack-2x folder-color-scheme"/>
        <i class="fa fa-plus fa-stack-1x fa-inverse" v-if="!addingFolder"/>
        <i class="fa fa-times fa-stack-1x fa-inverse" v-if="addingFolder"/>
      </span> -->
    </div>
  </div>

</template>

<script>

import { mapActions, mapGetters } from 'vuex'
import MoveTargetFolders from './MoveTargetFolders.vue'
import MoveTargetChecklists from './MoveTargetChecklists.vue'

export default {
  name: 'move-to-checklist',
  components: {
    MoveTargetFolders,
    MoveTargetChecklists,
  },
  props: {
    replaceAfterMove: {
      type: Boolean,
      default: false
    },
    parentModel: {
      type: String,
      default: 'checklist'
    }
  },
  data () {
    return {
      addingFolder: false,
      addingChecklist: false,
      currentFolder: Productivity.currentFolder ? Productivity.currentFolder : {},
      folders: [],
      checklists: [],
      checklistItems: [],
      folderInfoMessage: { content: undefined, type: undefined },
      checklistInfoMessage: { content: undefined, type: undefined },
      checklistItemInfoMessage: { content: undefined, type: undefined },
      isLoading: false,
      isStoringFolder: false,
      isStoringChecklist: false,
      newFolder: { name: undefined },
      selectedFolder: {},
      selectedChecklist: {},
      selectedChecklistItem: {},
      openChecklistId: null,
    }
  },
  computed: {
    ...mapGetters([
      'editableSubItem',
      'selected',
    ]),
    footerText: function() {
      return this.isSelectedChecklist ?
                'You can not move an item into itself' :
              this.isInSelectedChecklist ?
                'Item is already in this list' :
              this.selectedChecklist.title ?
                this.selectedChecklist.title :
              this.selectedChecklistItem.content ?
                this.selectedChecklistItem.content : null
    },
    headerText: function() {
      return this.selectedChecklist && this.selectedChecklist.title ? this.selectedChecklist.title : 'Choose a list'
    },
    isInSelectedChecklist: function() {
      return this.selectedChecklist.id && _.findIndex(this.selected.checklistItems, ['checklist_id', this.selectedChecklist.id]) !== -1
          || this.selectedChecklistItem.id && _.findIndex(this.selected.checklistItems, ['parent_id', this.selectedChecklistItem.id]) !== -1
    },
    isSelectedChecklist: function() {
      return _.findIndex(this.selected.checklistItems, ['id', this.selectedChecklistItem.id]) !== -1
    },
    moveButtonClass: function() {
      switch (this.selected.model) {
        case 'checklist': return 'btn-list'
          break;
        default: return 'btn-folder'

      }
    },
  },
  created: function() {
    this.resetAll()
    this.fetchInitialFoldersAndChecklists(this.currentFolder.id)
    this.$eventHub.$on('selectChecklist', this.selectChecklist);
    this.$eventHub.$on('openChecklist', this.openChecklist);
    this.$eventHub.$on('openFolder', this.openFolder);
    this.$eventHub.$on('selectChecklistItem', this.selectChecklistItem);
  },
  beforeDestroy: function() {
    this.$eventHub.$off('selectChecklist', this.selectChecklist);
    this.$eventHub.$off('openChecklist', this.openChecklist);
    this.$eventHub.$off('openFolder', this.openFolder);
    this.$eventHub.$off('selectChecklistItem', this.selectChecklistItem);
  },
  methods: {
    ...mapActions([
      'delistChecklistItem',
      'deselect',
      'moveChecklistItem',
      'removeCurrentlyEditable',
      'storeFolder',
      'toggleMovable',
      'updateChecklistItem',
    ]),
    cancel: function() {
      return this.toggleMovable()
    },
    closeChecklist: function() {
      this.openChecklistId = null
      this.refreshChecklistItems()
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
    fetchChecklistItems: function(checklist) {
      axios.post('/lists/'+checklist.fake_id+'/fetch-list-items')
      .then( response => this.checklistItems = response.data.checklist.items ? response.data.checklist.items : [] )
      .catch( error => this.setInfoMessage('An error has occurred. Please refresh this page.', 'error', 'checklist') )
    },
    // fetchChecklistItemChildren: function(item) {
    //   axios.post('/lists/items/'+item.id+'/fetch-child-list-items')
    //   .then( response => {
    //     // WIP: fix this
    //     // this.refreshCurrentFolder(response.data.folder)
    //     // this.refreshFolders(response.data.folder.children)
    //   })
    //   .catch( error => this.setInfoMessage('An error has occurred. Please refresh this page.', 'error', 'checklist-item') )
    // },
    fetchInitialFoldersAndChecklists: function(id = null) {
      this.isLoading = true
      this.resetInfoMessage()
      this.resetSelected()
      axios.post('/fetch-initial-tree', {folder_id: id, includeChecklists: true})
           .then(
              (response) => {
                if (!id) this.currentFolder = {name: 'Home', id: null}
                this.refreshFolders(response.data.folders)
                this.refreshChecklists(response.data.checklists)
              }
            )
           .catch(
              (response) => this.setInfoMessage('An error has occurred. Please refresh this page.', 'error', 'folder')
            )
    },
    fetchNewFoldersAndChecklists: function(folder) {
      this.isLoading = true
      this.resetInfoMessage()
      this.resetSelected()
      axios.post('/'+folder.fake_id+'/fetch-new-tree', {includeChecklists: true})
      .then(
        (response) => {
          this.refreshCurrentFolder(response.data.folder)
          this.refreshFolders(response.data.folder.children)
          this.refreshChecklists(response.data.folder.checklists)
        }
      )
      .catch(
        (response) => this.setInfoMessage('An error has occurred. Please refresh this page.', 'error', 'folder')
      )
    },
    handleSuccessfulFolderCreation: function(folder) {
      this.toggleAddingFolder('false')
      this.isStoringFolder = false
      this.folders.unshift(folder)
    },
    handleSuccessfulMove: function(response) {
      if (
        response.list_type == 'ta' // if the target checklist is a task list
        && this.replaceAfterMove //  and replace-after-move prop is set to true
        || response.switchParent //  and replace-after-move prop is set to true
      ) {
        for (var i = 0; i < response.selected.checklistItems.length; i++) {
          this.updateChecklistItem( response.selected.checklistItems[i] )
              .then( item => this.deselect( { model: 'checklist-item', listing: item.old } ) )
              .catch( error => console.log(error) )
        }
      } else {

        // WIP: ensure subItems are covered

        if (this.selected.checklistItems && this.selected.checklistItems.length) {
          for (var i = 0; i < this.selected.checklistItems.length; i++) {
            this.delistChecklistItem(this.selected.checklistItems[i])
                .then( checklistItem => this.deselect( {model: 'checklist-item', listing: checklistItem }) )
                .catch( response => {console.log('error delisting item');console.log(response);} )
          }
        }

      }

      this.removeCurrentlyEditable({ parentModel: this.parentModel })
    },
    moveTo: function() {
      var isSubItem = !! this.selectedChecklistItem.checklist_id,
          route = isSubItem && this.selectedChecklistItem.id ?
                    '/move-to-checklist-item/'+this.selectedChecklistItem.id :
                    '/move-to-checklist/'     +this.selectedChecklist.fake_id
      axios.patch(route, {selected: {checklistItems: this.selected.checklistItems} })
           .then( response => response.data.success ? this.handleSuccessfulMove(response.data) : console.log('Error moving (1)') )
           .catch( response => console.log(response) )
    },
    openChecklist: function(checklist) {
      this.openChecklistId = checklist.id
      this.fetchChecklistItems(checklist)
    },
    openFolder: function(folder) {
      return this.fetchNewFoldersAndChecklists(folder)
    },
    refreshFolders: function(freshFolders = null) {
      this.isLoading = false
      this.resetInfoMessage('folder')
      freshFolders ? this.folders = freshFolders : this.folders = {}
      if (_.isEmpty(freshFolders)) this.setInfoMessage('This folder has no children', 'info', 'folder')
    },
    refreshChecklists: function(freshChecklists = null) {
      this.isLoading = false
      this.resetInfoMessage('checklist')
      freshChecklists ? this.checklists = freshChecklists : this.checklists = {}
      if (_.isEmpty(freshChecklists)) this.setInfoMessage('This folder has no lists', 'info', 'checklist')
    },
    refreshChecklistItems: function(freshChecklistItems = null) {
      this.isLoading = false
      this.resetInfoMessage('checklist-item')
      freshChecklistItems ? this.checklistItems = freshChecklistItems : this.checklistItems = {}
    },
    refreshCurrentFolder: function(folder) {
      return folder.id ? this.currentFolder = folder : this.setInfoMessage('The folder could not be retrieved', 'error', 'folder')
    },
    removeItem: function(payload) {
      this.deselect(payload)
          .then( () => {
            if (payload.listing.id == this.editableSubItem.id) {
              this.removeCurrentlyEditable( { parentModel: this.parentModel } )
            }
          })
          .catch( (error) => console.log(error) )
    },
    resetAll: function() {
      this.resetSelected()
      this.refreshFolders()
      this.refreshChecklists()
      this.refreshChecklistItems()
    },
    resetSelected: function() {
      return this.selectedChecklist = this.selectedChecklistItem = {}
    },
    resetInfoMessage: function(model = null) {
      switch (model) {
        case 'folder':
          return this.folderInfoMessage = { content: undefined, type: undefined }
          break;
        case 'checklist':
          return this.checklistInfoMessage = { content: undefined, type: undefined }
          break;
        case 'checklist-item':
          return this.checklistItemInfoMessage = { content: undefined, type: undefined }
          break;
        default:
          return this.folderInfoMessage = this.checklistInfoMessage = this.checklistItemInfoMessage = { content: undefined, type: undefined }
      }
    },
    selectChecklist: function(checklist = null) {
      this.toggleAddingFolder('false')
      this.toggleAddingChecklist('false')
      this.resetSelected()
      this.refreshChecklistItems()
      if (checklist.id == this.openChecklistId) this.closeChecklist() // toggle openChecklistId
      return this.selectedChecklist = checklist && checklist.id ? checklist : {}
    },
    selectChecklistItem: function(item = null) {
      this.toggleAddingFolder('false')
      this.toggleAddingChecklist('false')
      this.resetSelected()
      return this.selectedChecklistItem = item && item.id ? item : {}
    },
    setInfoMessage: function(content, type, model = null) {
      switch (model) {
        case 'folder':
          return this.folderInfoMessage = { content:content, type:type }
          break;
        case 'checklist':
          return this.checklistInfoMessage = { content:content, type:type }
          break;
        case 'checklist-item':
          return this.checklistItemInfoMessage = { content:content, type:type }
          break;
        default:
          return this.folderInfoMessage = this.checklistInfoMessage = this.checklistItemInfoMessage = { content:content, type:type }
      }
    },
    toggleAddingFolder: function(boolean = null) {
      this.resetSelected()
      return boolean && boolean === 'false' ? this.addingFolder = false : this.addingFolder = ! this.addingFolder
    },
    toggleAddingChecklist: function(boolean = null) {
      this.resetSelected()
      return boolean && boolean === 'false' ? this.addingChecklist = false : this.addingChecklist = ! this.addingChecklist
    },
  },
}
</script>

<style lang="scss">
.move-to-checklist {
    background: white;
    border: 1px solid $base-border-color;
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    padding: 0;
    @include high-z-index(2);
    height: 100%;

    .move-to-checklist-heading {
        background: $body-bg;
        border-bottom: 1px solid $base-border-color;
        padding: 10px;
        text-align: left;
        position: relative;
        .fa-times,
        .fa-arrow-left {
            cursor: pointer;
            &:hover {
                color: $folder-primary;
            }
        }
        .heading-right {
            // float: right;
            // margin-top: 5px;
            position: absolute;
            top: 15px;
            right: 10px;
            @include high-z-index(0);
            cursor: pointer;
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

    }
    .add-folder-form {
        display: inline-block;
        width: 100%;
        margin: 0;
        margin-left: 10px;

        .add-folder-form-input {
            width: 60%;
            display: inline-block;
        }
        .add-folder-form-buttons {
            width: 38%;
            display: inline-block;
            .fa-check {
              color: white;
            }
        }
    }
    .move-to-checklist-body {
        height: 85%;
        overflow-x: hidden;
        padding: 10px 10px 10px 30px;
        position: relative;
        @include desktop-overflow-y-scroll;
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
        .nested-checklist-item,
        .nested-checklist,
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
        .nested-folder {
          cursor: pointer;
            .fa {
                color: $folder-primary;
            }
            &.active {
                color: $folder-primary;
                border: 1px dotted $folder-primary;
            }
        }
        .nested-checklist-item,
        .nested-checklist {
            .fa {
                color: $list-primary;
            }
            &.active {
                color: $list-primary;
                border: 1px dotted $list-primary;
            }
        }

        .nested-checklist {
          &.opened {
            padding-bottom: 5px;
            background: lighten($body-bg, 0.5%);
          }
        }
    }
    .move-to-checklist-footer {
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        // border-top: 1px solid $base-border-color;
        padding: 10px;
        @include transparent-linear-gradient;
        p {
            margin: 0;
            margin-left: 10px;
            font-size: 0.8em;
            display: inline-block;
            span.footer-text {
                color: $list-primary;
                font-weight: 600;
            }
        }
        .toggle-add-folder-btn {
            float: right;
            cursor: pointer;
            margin-top: 8px;
            .fa-folder {
                font-size: 1.5em;
                line-height: 16px;
            }
            .fa-times,
            .fa-plus {
                font-size: 0.7em;
                line-height: 18px;
            }
        }
    }

    .movable-selected-items {
      padding: 5px 5px 10px;
      background: $body-bg;
      margin-bottom: 20px;
      span {
        padding: 5px;
        background: white;
        color: $light-grey-text-color;
        margin-right: 5px;
        border-radius: $base-border-radius;
        border-color: $base-border-color;
      }
    }
}

</style>
