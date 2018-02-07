<template lang="html">
  <li
  class="nested-kanban-card folder enfoldable"
  :class="{ opened: folder.opened, selected: selected.folders.indexOf(folder) !== -1 }"
  @click.stop="toggleSelection({selection: {model: 'folder', listing: folder, parentModel: 'folder'}, event: $event})"
  @dblclick.stop="openNestedKanbanFolder(folder)" >

    <div class="nested-kanban-card-heading">

      <i
      class="fa fa-fw fa-folder"
      aria-hidden="true" />

      {{ folder.name | truncate(35) }}

      <span class="nested-kanban-card-buttons">

        <i
        class="fa fa-fw fa-link toggle-nested-kanban-btn"
          aria-hidden="true"
          @click.stop="navigateToNestedKanban(folder)"
          :id="'#nested-folder-'+folder.fake_id"
          v-tooltip.bottom="{
            content: 'Open Link',
            classes: 'folder',
            trigger: 'hover',
            autoHide: false,
            container: '#nested-folder-'+folder.fake_id
          }" />

      </span>

    </div>

  </li>

</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'kanban-sub-folder',
  props: {
    folder: {
      type: Object,
      required: true
    },
    ancestor: {
      type: Object,
      required: true
    }
  },
  computed: {
    ...mapGetters([
      'selected'
    ]),
  },
  methods: {
    ...mapActions([
      'addToKanbanArray',
      'fetchNestedKanbanDescendants',
      'navigateToNestedKanban',
      'toggleSelection',
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
