<template lang="html">
  <div class="action-nav">
      <create-new></create-new>
      <button type="button"
              class="btn btn-default btn-sm toggle-delete-btn"
              v-if="listingIsSelected&&!selected.movable&&selected.deletable"
              @click.once="toggleDeletable"
      ><i class="fa fa-times" aria-hidden="true"></i></button>
      <button type="button"
              class="btn btn-default btn-sm toggle-delete-btn"
              :class="{ 'delete-armed': selected.deletable }"
              v-if="listingIsSelected&&!selected.movable"
              @click.dblclick.prevent="confirmOrDelete"
      ><i class="fa fa-trash-o" aria-hidden="true"></i></button>
      <button type="button"
              class="btn btn-primary btn-sm toggle-move-btn"
              v-if="listingIsSelected&&!selected.movable"
              @click.prevent="toggleMovable"
      >Move</button>
  </div>
</template>

<script>
import CreateNew from './CreateNew.vue'
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'action-nav',
  methods: {
    ...mapActions([
      'deleteChecklist',
      'deleteFolder',
      'toggleDeletable',
      'toggleMovable'
    ]),
    confirmOrDelete: function() {
      this.selected.deletable ? this.delete() : this.toggleDeletable()
    },
    delete: function() {
      switch (this.selected.model) {
        case 'folder':
          this.deleteFolder(this.selected.listing).then(
            (response) => this.toggleDeletable('false'),
            (response) => this.handleDeleteError()
          )
          break;
        case 'checklist':
          this.deleteChecklist(this.selected.listing).then(
            (response) => this.toggleDeletable('false'),
            (response) => this.handleDeleteError()
          )
          break;
        default: console.log('Selected model not set.');

      }
    },
    handleDeleteError: function() {
      alert('Error deleting item')
    }
  },
  computed: {
    ...mapGetters([
      'selected'
    ]),
    listingIsSelected: function() {
      return this.selected.model && this.selected.id
    }
  },
  components: {
    CreateNew
  }
}
</script>

<style lang="css">
</style>
