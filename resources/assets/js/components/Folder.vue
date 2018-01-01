<template lang="html">
  <div class="folder">
    <div class="folder-name-wrapper" :class="{ editable: isEditable }" v-if="currentFolder.fake_id">
      <h4 @click="toggleEditability" id="folder-name">
        <i class="fa fw" :class="headingIcon" aria-hidden="true"/>
        <input type="text"
          id="folder-name-input"
          class="edit-folder-input"
          v-model="currentFolder.name"
          @keyup.enter="saveChanges"
          @keyup="debounceSaveChanges"
          @keydown="debounceSaveChanges"
          @cut="debounceSaveChanges"
          @paste="debounceSaveChanges"
          @blur="toggleEditability(false)"
        >
      </h4>
      <span v-if="isEditable" class="btn-folder btn-sm save-button" @click="saveChanges">
        <i class="fa" :class="savingIcon" aria-hidden="true"/>
        {{ savingText }}
      </span>
    </div>

    <ul class="folder-nav" id="folder-nav">
      <li :class="{ selected: view=='files' }" @click="setView('files')" id="select-files">Files</li>
      <li :class="{ selected: view=='tasks' }" @click="setView('tasks')" id="select-tasks">Tasks</li>
    </ul>

    <template v-if="view=='files'">
      <index-all/>
      <move-to-folder v-if="selectedIsMovable"/>
    </template>

    <template v-if="view=='tasks'">
      <index-tasks/>
      <move-to-checklist v-if="selectedIsMovable" :replace-after-move="true"/>
    </template>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import IndexAll from './IndexAll.vue'
import IndexTasks from './IndexTasks.vue'
import MoveToFolder from './MoveToFolder.vue'
import MoveToChecklist from './MoveToChecklist.vue'

export default {
  name: 'folder',
  components: {
    IndexAll,
    IndexTasks,
    MoveToFolder,
    MoveToChecklist
  },
  data () {
    return {
      view: 'files',
      isSaving: false,
      hasSavingError: false,
    }
  },
  computed: {
    ...mapGetters([
      'selectedIsMovable',
      'currentFolder',
      'isEditable',
    ]),
    headingIcon: function() {
      return this.isEditable ? 'fa-pencil' : 'fa-folder-open'
    },
    savingIcon: function() {
      return this.hasSavingError ? 'fa-exclamation-circle' : this.isSaving ? 'fa-spin fa-circle-o-notch' : 'fa-floppy-o'
    },
    savingText: function() {
      return this.hasSavingError ? 'Error saving folder' : this.isSaving ? 'Saving...' : 'Save'
    },
  },
  methods: {
    ...mapActions([
      'addNotice',
      'clearSelected',
      'saveFolder',
      'toggleEditability',
    ]),
    setView: function(view) {
      this.clearSelected()
      return this.view = view
    },
    debounceSaveChanges: _.debounce(function() {
      this.isSaving = true
      this.saveChanges()
    }, 1000),
    saveChanges: function() {
        this.isSaving = true
        this.hasSavingError = false
        console.log(this.currentFolder.name);
        if ( ! this.currentFolder.name) {
           this.addNotice({
            type: 'error',
            heading: 'Error',
            message: 'Please provide a folder name.',
            persist: false,
          })
        }
        this.saveFolder(this.currentFolder)
            .then(
              () => this.isSaving = false
            )
            .catch(
              () => {
                this.hasSavingError = true
                this.isSaving = false
                console.log('Error saving Folder');
              })
    },
  },
}
</script>

<style lang="scss">
.folder {
  height: 100%;
  overflow: hidden;

  .index-tasks {
      height: 93%;
  }

  .folder-name-wrapper {
    color: $folder-primary;
    display: block;
    position: relative;
    width: 100%;
    padding: 0;

    input {
      width: 70%;
    }

    &.editable {
      color: black;
    }

    .save-button {
      position: absolute;
      right: 0;
      top: 0;
      bottom: 0;
      padding: 5px;
    }

  }

  .toggle-edit-btn {
    color: $light-grey-text-color;
    font-size: 0.5em;
    cursor: pointer;
  }

  .folder-nav {
      display: block;
      padding: 0;
      margin-bottom: 20px;

      li {
          display: inline-block;
          cursor: pointer;
          &:not(:last-child) {
              margin-right: 20px;
          }
          &.selected {
              border-bottom: 2px solid $folder-primary;
          }
      }
  }

  .edit-folder-input {
      border: 0;
      padding: 0;
      margin:0;
      outline: none;
      display: inline;
      width: auto;
      line-height: 1.2;
      font-size: 1.25em;
      font-weight: $font-weight-normal;
      font-family: $title-font-family;
      background: transparent;
  }
}



</style>
