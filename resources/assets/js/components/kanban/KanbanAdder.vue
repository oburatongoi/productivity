<template lang="html">
  <div
  class="kanban-adder"
  :class="size" >

    <div
    class="add-nested-kanban-button"
    :class="parent.model" v-if="!isAddingNestedKanban"
    @click="toggleAddingNestedKanban" >

      <i
      class="fa fa-fw fa-plus"
      aria-hidden="true"/>

      <span v-if="size=='small'">Add</span>

    </div>

    <template v-if="isAddingNestedKanban">

      <div
      class="add-nested-kanban-chooser"
      :class="parent.model"
      v-if="!kanbanAddableModel" >

        <template v-if="parent.model=='folder'">

          <span
          class="add-folder-chooser folder"
          @click="selectKanbanAddableModel('folder')" >

            <i
            class="fa fa-fw fa-plus"
            aria-hidden="true" />
            Folder
          </span>

          <span
          class="add-list-chooser middle list"
          @click="selectKanbanAddableModel('checklist')" >

            <i
            class="fa fa-fw fa-plus"
            aria-hidden="true"/>
            List
          </span>

        </template>

        <template v-if="parent.model=='checklist'&&!parent.parent_id">

          <span
          class="add-folder-chooser section"
          @click="selectKanbanAddableModel('section')" >

            <i
            class="fa fa-fw fa-plus"
            aria-hidden="true" />
            Section
          </span>

          <span
          class="add-list-chooser middle item"
          @click="selectKanbanAddableModel('checklist-item')" >

            <i
            class="fa fa-fw fa-plus"
            aria-hidden="true" />
            Item
          </span>

        </template>

        <template v-if="parent.model=='checklist-item'||parent.model=='checklist'&&!!parent.parent_id">

          <span
          class="add-list-chooser sub-item"
          @click="selectKanbanAddableModel('checklist-item')" >

            <i
            class="fa fa-fw fa-plus"
            aria-hidden="true" />
            Item
          </span>

        </template>

        <span
        class="cancel-add-nested-kanban cancel"
        @click="toggleAddingNestedKanban" >

          <i
          class="fa fa-fw fa-times"
          aria-hidden="true" />
          Cancel
        </span>

      </div>

      <form
      class="add-nested-kanban-form"
      :class="kanbanAddableModel"
      v-if="kanbanAddableModel"
      @submit.prevent="addNestedKanban"
      autocomplete="off" >

        <i
        class="fa fa-fw add-nested-kanban-input-icon"
        :class="addNestedKanbanInputIcon"
        aria-hidden="true" />

        <input
        type="text"
        name=""
        v-model="nameTitleOrContent"
        :placeholder="addNestedKanbanInputPlaceholder"
        v-focus
        @blur="cancelIfEmpty" >

        <i
        class="fa fa-fw fa-times cancel-add-nested-kanban-icon"
        aria-hidden="true"
        @click="toggleAddingNestedKanban" />

      </form>

    </template>

  </div>

</template>

<script>
import { mapActions } from 'vuex'
export default {
  name: 'kanban-adder',
  props: {
    parent: {
      type: Object,
      required: true
    },
    size: {
      type: String,
      default: 'normal' // use 'small' for thinner look
    }
  },
  data () {
    return {
      isAddingNestedKanban: false,
      kanbanAddableModel: null,
      nameTitleOrContent: null
    }
  },
  computed: {
    addNestedKanbanInputIcon: function() {
      switch (this.kanbanAddableModel) {
        case 'folder':
          return 'fa-folder'
          break;
        case 'checklist':
          return 'fa-list'
          break;
        case 'section':
          return 'fa-window-maximize'
          break;
        case 'checklist-item':
          return 'fa-circle-thin'
          break;
        default: ''
      }
    },
    addNestedKanbanInputPlaceholder: function() {
      switch (this.kanbanAddableModel) {
        case 'folder':
          return 'Folder name'
          break;
        case 'checklist':
          return 'List title'
          break;
        case 'section':
          return 'Section title'
          break;
        case 'checklist-item':
          return 'Add item'
          break;
        default: ''
      }
    },
  },
  methods: {
    ...mapActions([
      'addToKanbanArray',
      'storeChecklist',
      'storeChecklistItem',
      'storeSubChecklistItem',
      'storeFolder',
    ]),
    cancelIfEmpty: function() {
      if (!this.nameTitleOrContent) this.resetNestedKanban()
    },
    toggleAddingNestedKanban: function() {
      this.kanbanAddableModel = null
      this.nameTitleOrContent = null
      this.isAddingNestedKanban = ! this.isAddingNestedKanban
      if (this.isAddingNestedKanban && this.parent.model == 'checklist-item' || this.parent.model == 'checklist' && !! this.parent.parent_id) {
        this.selectKanbanAddableModel('checklist-item')
      }
    },
    resetNestedKanban: function() {
      this.kanbanAddableModel = null
      this.nameTitleOrContent = null
      this.isAddingNestedKanban = false
    },
    selectKanbanAddableModel: function(model = null) {
      return this.kanbanAddableModel = model
    },
    addNestedKanban: function() {
      if (this.parent.infoMessage) this.$set(this.parent, 'infoMessage', null)
      switch (this.kanbanAddableModel) {
        case 'folder':
          let folder = {
            name: this.nameTitleOrContent,
            folder_id: this.parent.id
          }
          if (!this.parent.subfolders) this.$set(this.parent, 'subfolders', [])
          this.storeFolder(folder)
              .then( (newFolder) => this.addToKanbanArray( { array: this.parent.subfolders, value: newFolder } ) )
          break;
        case 'checklist':
          let checklist = {
            title: this.nameTitleOrContent,
            folder_id: this.parent.id
          }
          if (!this.parent.checklists) this.$set(this.parent, 'checklists', [])
          this.storeChecklist(checklist)
              .then( (newChecklist) => this.addToKanbanArray( { array: this.parent.checklists, value: newChecklist } ) )
          break;
        case 'section':
          let section = {
            title: this.nameTitleOrContent,
            parent_id: this.parent.id
          }
          if (!this.parent.sections) this.$set(this.parent, 'sections', [])
          this.storeChecklist(section)
              .then( (newChecklist) => this.addToKanbanArray( { array: this.parent.sections, value: newChecklist } ) )
          break;
        case 'checklist-item':
          let item
          if(this.parent.model == 'checklist') {
            item = {
              content: this.nameTitleOrContent,
              checklist_id: this.parent.id
            }
            if (!this.parent.items) this.$set(this.parent, 'items', [])
            this.storeChecklistItem({ item, parent: this.parent })
                .then( (newItem) => this.addToKanbanArray( { array: this.parent.items, value: newItem } ) )
          }
          else if(this.parent.model == 'checklist-item') {
            item = {
              content: this.nameTitleOrContent,
              parent_id: this.parent.id
            }
            if (!this.parent.sub_items) this.$set(this.parent, 'sub_items', [])
            this.storeSubChecklistItem({ item, parent: this.parent })
                .then( (newItem) => this.addToKanbanArray( { array: this.parent.sub_items, value: newItem } ) )
          }

          break;
      }

      if (this.kanbanAddableModel == 'checklist-item') {
        this.nameTitleOrContent = null
      } else {
        this.resetNestedKanban()
      }
    }
  }
}
</script>

<style lang="scss">
.add-nested-kanban-button {
  // border: 1px solid $base-border-color;
  border: 1px solid white;
  border-radius: 3px;
  padding: 5px;
  background: white;
  color: darken($base-border-color, 10%);
  font-size: 0.9em;
  cursor: pointer;
  text-align: center;

  &.folder:hover {
    color: $folder-primary;
    // border: 1px solid $folder-primary;
    border: 1px solid white;
  }

  &.checklist-item:hover,
  &.checklist:hover {
    color: $list-primary;
    // border: 1px solid $list-primary;
    border: 1px solid white;
  }

  .kanban-adder.small & {
    padding: 5px;
    border: 0;
    text-align: left;
    &:hover {
      border: 0;
    }
  }
}

.add-nested-kanban-chooser {
  // border: 1px solid $base-border-color;
  border: 1px solid white;
  border-radius: 3px;
  background: white;
  overflow: hidden;
  text-align: center;

  &.checklist span,
  &.folder span {
    width: 33%;
  }

  .kanban-adder.small & span {
    padding: 5px;
  }

  span {
    display: inline-block;
    padding: 5px;
    cursor: pointer;

    &.folder {
      color: $folder-primary;
    }

    &.section,
    &.list,
    &.item {
      color: $list-primary;
    }

    &.middle {
      border-left: 1px solid $base-border-color;
      border-right: 1px solid $base-border-color;
    }

    &.cancel {
      color: darken($base-border-color, 15%);
    }
  }
}

.add-nested-kanban-form {
  display: block;
  position: relative;

  input {
    width: 100%;
    padding: 5px 5px 5px 28px;
    // border: 1px solid $base-border-color;
    border: 1px solid white;
    border-radius: 3px;
    outline: none;
  }

  .kanban-adder.small & input {
    padding: 5px 5px 5px 28px;
  }

  .cancel-add-nested-kanban-icon {
    position: absolute;
    top: 5px;
    right: 5px;
    padding: 5px;
    background: rgba(255,255,255,0.5);
    color: $base-border-color;
    cursor: pointer;

    .kanban-adder.small & {
      top: 5px;
    }
  }

  .add-nested-kanban-input-icon {
    position: absolute;
    top: 5px;
    left: 5px;
    padding: 5px;

    .kanban-adder.small & {
      top: 5px;
    }

    .folder > & {
      color: $folder-primary !important;
    }

    .section > &,
    .checklist > &,
    .checklist-item > & {
      color: $list-primary !important;
    }
  }
}
</style>
