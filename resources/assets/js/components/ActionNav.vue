<template lang="html">
  <nav class="action-nav">
    <span class="btn btn-sm toggle-create-new-btn btn-primary" v-if="!showCreatingNewButtons" @click="toggleCreatingNewButtons">
      <a href="#" @click.prevent>
        <i class="fa fa-plus" aria-hidden="true"></i>
      </a>
    </span>

    <span class="">
      <create-new v-if="showCreatingNewButtons||creatingNew"></create-new>

      <search v-if="!showCreatingNewButtons"></search>

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
      ><i class="fa fa-trash-o" aria-hidden="true"></i><span v-if="selected.deletable"> Delete</span></button>
      <button type="button"
              class="btn btn-primary btn-sm toggle-move-btn"
              v-if="listingIsSelected&&!selected.movable"
              @click.prevent="toggleMovable"
      >Move</button>
    </span>
</nav>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import CreateNew from './CreateNew.vue'
import Search from './Search.vue'

export default {
  name: 'action-nav',
  methods: {
    ...mapActions([
      'toggleCreatingNewButtons',
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
      'showCreatingNewButtons',
      'creatingNew',
      'selected'
    ]),
    listingIsSelected: function() {
      return this.selected.model && this.selected.id
    }
  },
  components: {
    CreateNew,
    Search
  }
}
</script>

<style lang="css">
</style>
