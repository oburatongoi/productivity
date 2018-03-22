<template lang="html">
  <div class="mover-adder" :class="model">
    <span
      class="mover-add-button"
      @click="toggleMoverIsAdding(true)"
      v-if="!moverIsAdding"
    >
      <i class="far fa-fw fa-plus"/>
      <span>Add {{ model | capitalize }}</span>
    </span>

    <form class="form-horizontal mover-adder-form" v-if="moverIsAdding" @submit.prevent="createNew" autocomplete="off">
      <div class="mover-adder-form-input">
        <input type="text" class="form-control input-sm" v-focus v-model="newMovableFolder.name" placeholder="New Folder Name" maxlength="255" v-if="model=='folder'">
        <input type="text" class="form-control input-sm" v-focus v-model="newMovableChecklist.title" placeholder="New List Title" maxlength="255" v-if="model=='checklist'">
      </div>
      <div class="mover-adder-form-buttons">
        <button type="submit" class="btn btn-sm" :class="buttonClass">
          <i class="far fa-fw fa-plus" aria-hidden="true"/>
          Add
        </button>
        <button type="button" class="btn btn-default btn-sm" @click.prevent="toggleMoverIsAdding(false)">
          <i class="far fa-fw fa-times" aria-hidden="true"/>
          Cancel
        </button>
      </div>
    </form>
  </div>

</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'mover-adder',
  filters: {
    capitalize: function (value) {
      if (!value) return ''
      value = value.toString()
      return value.charAt(0).toUpperCase() + value.slice(1)
    }
  },
  props: {
    model: {
      type: String,
      required: true
    },
  },
  data () {
    return {
      newMovableFolder: { name: null },
      newMovableChecklist: { title: null },
    }
  },
  computed: {
    ...mapGetters([
      'movableFolders',
      'moverContext',
      'moverIsAddingChecklist',
      'moverIsAddingFolder',
      'openMovableChecklist',
      'openMovableFolder',
      'isStoringMovableChecklist',
      'isStoringMovableFolder',
    ]),
    buttonClass: function() {
      return this.model == 'checklist' ? 'btn-list' : 'btn-folder'
    },
    moverIsAdding: function() {
      return this.model == 'folder' && this.moverIsAddingFolder || this.model == 'checklist' && this.moverIsAddingChecklist
    }
  },
  beforeDestroy: function() {
    this.setMoverVariable({ variable: 'isStoringMovableFolder', value: false })
    this.setMoverVariable({ variable: 'isStoringMovableChecklist', value: false })
    this.newMovableFolder.name = null
    this.newMovableChecklist.title = null
  },
  methods: {
    ...mapActions([
      'addToMoverArray',
      'setMoverVariable',
      'storeChecklist',
      'storeFolder',
      'toggleMoverVariable',
    ]),
    createNew: function() {
      let variable
      switch (this.model) {
        case 'folder':
          this.setMoverVariable({ variable: 'isStoringMovableFolder', value: true })
          let folder = {
            name: this.newMovableFolder.name,
            folder_id:this.openMovableFolder.id
          };

          if(folder.name)
            this.storeFolder(folder)
                .then( folder => this.handleSuccessfulFolderCreation(folder) )
                .catch( response => {
                  this.setMoverVariable({ variable: 'isStoringMovableFolder', value: false })
                  if(response.name) this.handleSuccessfulFolderCreation(response)
                  else console.log('Error creating folder')
                })
          break;
        case 'checklist':
          this.setMoverVariable({ variable: 'isStoringMovableChecklist', value: true })
          let checklist = {
            title: this.newMovableChecklist.title,
            folder_id: this.moverContext == 'folder' ? this.openMovableFolder.id : null,
            checklist_id: this.moverContext == 'checklist' ? this.openMovableChecklist.id : null
          };

          if(checklist.title)
            this.storeChecklist(checklist)
                .then( checklist => this.handleSuccessfulChecklistCreation(checklist) )
                .catch( response => {
                  this.setMoverVariable({ variable: 'isStoringMovableChecklist', value: false })
                  if (response.title) this.handleSuccessfulChecklistCreation(response)
                  else console.log('Error creating checklist')
                })
          break;
      }
    },
    handleSuccessfulFolderCreation: function(folder) {
      if( !! this.moverIsAddingFolder ) this.toggleMoverVariable({ variable: 'moverIsAddingFolder', value: false })
      if( !! this.isStoringMovableFolder ) this.setMoverVariable({ variable: 'isStoringMovableFolder', value: false })
      this.addToMoverArray({ array: 'movableFolders', value: folder })
      this.newMovableFolder.name = null
    },
    handleSuccessfulChecklistCreation: function(checklist) {
      if( !! this.moverIsAddingChecklist ) this.toggleMoverVariable({ variable: 'moverIsAddingChecklist', value: false })
      if( !! this.isStoringMovableChecklist ) this.setMoverVariable({ variable: 'isStoringMovableChecklist', value: false })
      this.addToMoverArray({ array: 'movableChecklists', value: checklist })
      this.newMovableChecklist.title = null
    },
    toggleMoverIsAdding: function(value = null) {
      switch (this.model) {
        case 'folder':
          this.toggleMoverVariable({ variable: 'moverIsAddingFolder', value })
          break;
        case 'checklist':
          this.toggleMoverVariable({ variable: 'moverIsAddingChecklist', value })
          break;
        default:
          //toggle them both
          this.toggleMoverVariable({ variable: 'moverIsAddingFolder', value })
          this.toggleMoverVariable({ variable: 'moverIsAddingChecklist', value })
      }
      // deselect any selected items
      this.setMoverVariable({ variable: 'selectedMovableChecklist', value: {} })
      this.setMoverVariable({ variable: 'selectedMovableChecklistItem', value: {} })

      // reset values to null
      this.newMovableFolder.name = null
      this.newMovableChecklist.title = null
    },
  },
}
</script>

<style lang="scss">
.mover-adder {
  &.folder {
    .mover-add-button .fa-plus {
      color: $folder-primary;
    }
  }

  &.checklist {
    .mover-add-button .fa-plus {
      color: $list-primary;
    }
  }

}

.mover-add-button {
  cursor: pointer;
  display: block;
  padding: 5px;
  border-radius: 3px;
  &:hover {
    background: lighten($body-bg, 0.5%);
  }
}

.mover-adder-form {
  display: inline-block;
  width: 100%;
  margin: 0;
  margin-left: 10px;

  .mover-adder-form-input {
    width: 60%;
    display: inline-block;
  }
  .mover-adder-form-buttons {
    width: 38%;
    display: inline-block;
    .fa-check {
      color: white;
    }
  }
}
</style>
