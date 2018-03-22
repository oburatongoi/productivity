<template lang="html">
  <div class="folder-name-wrapper" :class="{ editable: isEditable }">
    <template v-if="currentFolder.fake_id">
      <h4 @click="toggleEditability" id="folder-name">
        <i class="fas fa-fw" :class="headingIcon" aria-hidden="true"/>
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
    </template>

    <h4 v-if="!currentFolder||!currentFolder.fake_id" id="folder-name">
      <span class="edit-folder-input">
        <i class="fas fw fa-home" aria-hidden="true"/>
        Home
      </span>
    </h4>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'edit-folder-name',
  data () {
    return {
      isSaving: false,
      hasSavingError: false,
    }
  },
  computed: {
    ...mapGetters([
      'currentFolder',
      'isEditable',
    ]),
    headingIcon: function() {
      return this.isEditable ? 'fa-pencil' : 'fa-folder-open'
    },
    savingIcon: function() {
      return this.hasSavingError ? 'fa-exclamation-circle' : this.isSaving ? 'fa-spin fa-circle-notch' : 'fa-save'
    },
    savingText: function() {
      return this.hasSavingError ? 'Error saving folder' : this.isSaving ? 'Saving...' : 'Save'
    },
  },
  methods: {
    ...mapActions([
      'addNotice',
      'saveFolder',
      'toggleEditability',
    ]),
    debounceSaveChanges: _.debounce(function() {
      this.isSaving = true
      this.saveChanges()
    }, 1000),
    saveChanges: function() {
        this.isSaving = true
        this.hasSavingError = false
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

  .save-button {
    position: absolute;
    right: 0;
    top: 0;
    bottom: 0;
    padding: 5px;
  }

}
</style>
