<template lang="html">
  <nav class="action-nav">
    <div class="available-actions">
      <button type="button"
        id="toggle-move-btn"
        class="btn btn-sm toggle-move-btn"
        :class="moveButtonClass"
        v-if="!selected.deletable"
        @click.prevent="toggleMovable"
      >Move</button>
      <button type="button"
        id="confirm-or-delete-btn"
        class="btn btn-default btn-sm toggle-delete-btn"
        :class="{ 'delete-armed': selected.deletable }"
        @click.dblclick.prevent="confirmOrDelete"
      ><i class="fa fa-trash-o" aria-hidden="true"></i><span v-if="selected.deletable"> Delete</span></button>
      <button type="button"
        id="toggle-delete-btn"
        class="btn btn-default btn-sm toggle-delete-btn"
        v-if="selected.deletable"
        @click.once="toggleDeletable"
      ><i class="fa fa-times" aria-hidden="true"></i></button>
      <button type="button"
        id="clear-selected-btn"
        class="btn btn-sm btn-default"
        v-if="!selected.deletable"
        @click.prevent="clearSelected"
      ><i class="fa fa-times" aria-hidden="true"></i></button>
    </div>
  </nav>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'action-nav',
  methods: {
    ...mapActions([
      'deleteSelection',
      'clearSelected',
      'toggleDeletable',
      'toggleMovable'
    ]),
    confirmOrDelete: function() {
      return this.selected.deletable ? this.deleteSelection() : this.toggleDeletable()
    }
  },
  computed: {
    ...mapGetters([
      'selected'
    ]),
    moveButtonClass: function() {
      if (!this.selected.folders.length && this.selected.checklists.length || this.selected.checklistItems.length) {
        return 'btn-list'
      }

      return 'btn-folder'

    }
  }
}
</script>

<style lang="css">
</style>
