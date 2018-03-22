<template lang="html">
  <!-- <li
  class="nested-kanban-card folder enfoldable"
  :class="{ opened: folder.opened, selected: selected.folders.indexOf(folder) !== -1 }"
  @click.stop="toggleSelection({selection: {model: 'folder', listing: folder, parentModel: 'folder'}, event: $event})"
  @dblclick.stop="toggleNestedKanban(folder)" > -->
  <li
  class="nested-kanban-card folder enfoldable"
  :class="{ opened: folder.opened, selected: selected.folders.indexOf(folder) !== -1 }"
  @click.stop="toggleNestedKanban(folder)"
  @dblclick.stop="toggleNestedKanban(folder)" >

    <div class="nested-kanban-card-heading">

      <span
      class="close-nested-kanban nested-kanban-card-icon"
      @click.stop="closeNestedKanbanFolder(folder)"
      v-if="hasSubFolderChain" >

        <i
        class="far fa-fw fa-chevron-left"
        aria-hidden="true" />

        <span>Back</span>

      </span>

      <i
      class="fas fa-fw fa-folder"
      aria-hidden="true"/>

      {{ currentKanbanFolder.name | truncate(35) }}

      <span class="nested-kanban-card-icons">

        <i
        class="far fa-fw fa-chevron-right nested-kanban-card-icon"
        aria-hidden="true"
        @click.stop="navigateToNestedKanban(folder)"
        :id="'#nested-folder-'+folder.fake_id"
        :title="'Navigate to '+ folder.name" />

        <i
        class="far fa-fw fa-times nested-kanban-card-icon"
        aria-hidden="true"
        @click.stop="toggleNestedKanban(folder)"
        v-if="!!folder.opened&&!hasSubFolderChain" />

      </span>

    </div>

    <template v-if="!!folder.opened">

      <ul class="nested-kanban-card-body">

        <i
        class="fal fa-fw fa-circle-notch fa-spin loading-icon"
        aria-hidden="true"
        v-if="currentKanbanFolder.isLoading" />

        <p
        class="info-message"
        v-if="currentKanbanFolder.infoMessage">{{ currentKanbanFolder.infoMessage }}</p>

        <template
        v-if="currentKanbanFolder.subfolders
        &&currentKanbanFolder.subfolders.length">

          <kanban-sub-folder
          v-for="subfolder in currentKanbanFolder.subfolders"
          :key="subfolder.id"
          :folder="subfolder"
          :ancestor="folder" />

        </template>

        <template
        v-if="currentKanbanFolder.checklists
        &&currentKanbanFolder.checklists.length">

          <kanban-checklist
          v-for="checklist in currentKanbanFolder.checklists"
          :key="checklist.id"
          :checklist="checklist" />

        </template>

      </ul>

      <div class="nested-kanban-card-footer">

        <kanban-adder :parent="currentKanbanFolder"/>

      </div>

    </template>

  </li>

</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import KanbanAdder from './KanbanAdder.vue'
import KanbanChecklist from './KanbanChecklist.vue'
import KanbanSubFolder from './KanbanSubFolder.vue'
export default {
  name: 'kanban-folder',
  components: {
      KanbanAdder,
      KanbanChecklist,
      KanbanSubFolder,
  },
  props: {
    folder: {
      type: Object,
      required: true
    }
  },
  computed: {
    ...mapGetters([
      'selected'
    ]),
    currentKanbanFolder: function() {
      return this.hasSubFolderChain ? this.folder.subfolderChain[this.folder.subfolderChain.length-1] : this.folder
    },
    hasSubFolderChain: function() {
      return this.folder.subfolderChain && this.folder.subfolderChain.length
    },
  },
  methods: {
    ...mapActions([
      'navigateToNestedKanban',
      'removeFromKanbanArray',
      'toggleNestedKanban',
      // 'toggleSelection',
    ]),
    closeNestedKanbanFolder: function(folder) {
      this.removeFromKanbanArray({ array: this.folder.subfolderChain, value: folder })
    },
  },
}
</script>

<style lang="scss">

</style>
