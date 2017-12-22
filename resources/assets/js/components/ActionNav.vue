<template lang="html">
  <nav class="action-nav">
    <div class="available-actions">
      <button
        type="button"
        id="toggle-move-btn"
        class="btn btn-sm toggle-move-btn"
        :class="moveButtonClass"
        v-if="!selected.deletable"
        @click.prevent="toggleMovable"
      >Move</button>
      <button
        type="button"
        id="confirm-or-delete-btn"
        class="btn btn-default btn-sm toggle-delete-btn"
        :class="{ 'delete-armed': selected.deletable }"
        @click.prevent="confirmOrDelete"
        @dblclick.prevent="confirmOrDelete"
      ><i class="fa fa-trash-o" aria-hidden="true"/><span v-if="selected.deletable"> Delete</span></button>
      <button
        type="button"
        id="toggle-delete-btn"
        class="btn btn-default btn-sm toggle-delete-btn"
        v-if="selected.deletable"
        @click.once="toggleDeletable"
      ><i class="fa fa-times" aria-hidden="true"/></button>
      <button
        type="button"
        id="clear-selected-btn"
        class="btn btn-sm btn-default"
        v-if="!selected.deletable"
        @click.prevent="clearSelected"
      ><i class="fa fa-times" aria-hidden="true"/></button>
    </div>
  </nav>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'action-nav',
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
  },
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
}
</script>

<style lang="css">
</style>
