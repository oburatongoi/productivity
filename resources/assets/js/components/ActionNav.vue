<template lang="html">
  <nav class="action-nav">
    <div class="available-actions">
      <button type="button"
        class="btn btn-sm toggle-move-btn"
        :class="moveButtonClass"
        @click.prevent="toggleMovable"
      >Move</button>
      <button type="button"
        class="btn btn-default btn-sm toggle-delete-btn"
        :class="{ 'delete-armed': selected.deletable }"
        @click.dblclick.prevent="confirmOrDelete"
      ><i class="fa fa-trash-o" aria-hidden="true"></i><span v-if="selected.deletable"> Delete</span></button>
      <button type="button"
        class="btn btn-default btn-sm toggle-delete-btn"
        v-if="selected.deletable"
        @click.once="toggleDeletable"
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
      'deleteChecklist',
      'deleteFolder',
      'deselectListing',
      'toggleDeletable',
      'toggleMovable'
    ]),
    confirmOrDelete: function() {
      this.selected.deletable ? this.delete() : this.toggleDeletable()
    },
    delete: function() {
      switch (this.selected.model) {
        case 'folder':
          this.deleteFolder(this.selected.listing)
          .then(
            (response) => this.handleSuccessfulDelete()
          )
          .catch(
            (error) => this.handleDeleteError(error)
          )
          break;
        case 'checklist':
          this.deleteChecklist(this.selected.listing)
          .then(
            (response) => this.handleSuccessfulDelete()
          )
          .catch(
            (error) => this.handleDeleteError(error)
          )
          break;
        default: console.log('Selected model not set.');

      }
    },
    handleSuccessfulDelete: function() {
      this.toggleDeletable('false')
      this.deselectListing()
    },
    handleDeleteError: function(error) {
      if ( error.status === 420 && error.message.includes("Hosts unreachable")) {
        console.log('There was a problem reaching the Algolia Server, either because you are offline, or because your access is blocked by a firewall.');
        this.toggleDeletable('false')
        this.deselectListing()
      } else {
        console.log(error);
      }
    }
  },
  computed: {
    ...mapGetters([
      'selected'
    ]),
    moveButtonClass: function() {
      switch (this.selected.model) {
        case 'checklist': return 'btn-list'
          break;
        default: return 'btn-folder'

      }
    }
  }
}
</script>

<style lang="css">
</style>
