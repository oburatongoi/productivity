<template lang="html">
  <!-- <li
  class="nested-kanban-card folder enfoldable"
  :class="{ opened: folder.opened, selected: selected.folders.indexOf(folder) !== -1 }"
  @click.stop="toggleSelection({selection: {model: 'folder', listing: folder, parentModel: 'folder'}, event: $event})"
  @dblclick.stop="openNestedKanbanFolder(folder)" > -->
  <li
  class="nested-kanban-card folder enfoldable"
  :class="{ opened: folder.opened }"
  @click.stop="openNestedKanbanFolder(folder)"
  @dblclick.stop="openNestedKanbanFolder(folder)" >

    <div class="nested-kanban-card-heading">

      <i
      class="fas fa-fw fa-folder"
      aria-hidden="true" />

      {{ folder.name | truncate(truncateLength) }}

      <i
      class="fas fa-fw toggle-button"
      :class="toggleIconClass"
      aria-hidden="true"
      @click.stop="toggleNestedKanban(folder)" />

      <span class="nested-kanban-card-icons">

        <i
        class="far fa-fw fa-arrow-circle-right nested-kanban-card-icon"
        aria-hidden="true"
        @click.stop="navigateToNestedKanban(folder)"
        :id="'#nested-folder-'+folder.fake_id"
        :title="'Navigate to '+ folder.name" />

      </span>

    </div>

  </li>

</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'kanban-sub-folder',
  props: {
    ancestor: {
      type: Object,
      required: true
    },
    folder: {
      type: Object,
      required: true
    },
    truncateLength: {
      type: Number,
      default: 45
    },
  },
  computed: {
    // ...mapGetters([
    //   'selected'
    // ]),
    toggleIconClass: function() {
      return this.folder.opened ? 'fa-caret-up' : 'fa-caret-down';
    },
  },
  methods: {
    ...mapActions([
      'addToKanbanArray',
      'fetchNestedKanbanDescendants',
      'navigateToNestedKanban',
      // 'toggleSelection',
    ]),
    openNestedKanbanFolder: function(folder) {
      if (!this.ancestor.subfolderChain) this.$set(this.ancestor, 'subfolderChain', [])
      this.addToKanbanArray({ array: this.ancestor.subfolderChain, value: folder })
          .then( () => this.fetchNestedKanbanDescendants(folder) )
    },
  },
}
</script>

<style lang="scss">

</style>
