<template lang="html">
  <nav class="navbar navbar-default action-nav">
    <div class="container">
        <div class="row">
            <div class="col-xs-12 col-sm-2">
                <button type="button" class="btn btn-sm toggle-create-new-btn btn-primary" @click="toggleCreatingNewButtons">New</button>
            </div>
            <div class="col-xs-12 col-sm-10">
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
            </div>
        </div>
    </div>
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
          this.deleteFolder(this.selected.listing).then(
            (response) => this.handleSuccessfulDelete(),
            (response) => this.handleDeleteError(response)
          )
          break;
        case 'checklist':
          this.deleteChecklist(this.selected.listing).then(
            (response) => this.handleSuccessfulDelete(),
            (response) => this.handleDeleteError(response)
          )
          break;
        default: console.log('Selected model not set.');

      }
    },
    handleSuccessfulDelete: function() {
      this.toggleDeletable('false')
      this.deselectListing()
    },
    handleDeleteError: function(response) {
      console.log(response.error);
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
