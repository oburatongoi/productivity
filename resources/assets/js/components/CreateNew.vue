<template lang="html">

  <div class="create-new">

    <template v-if="showCreatingNewButtons&&!creatingNew">
      <button type="button" class="btn btn-xs btn-primary" @click="toggleCreateNew('folder')">
        <i class="fa fa-fw fa-folder" aria-hidden="true"></i>
        Folder
      </button>

      <button type="button" class="btn btn-xs btn-list" @click="toggleCreateNew('list')">
        <i class="fa fa-fw fa-list" aria-hidden="true"></i>
        List
      </button>

      <!-- <button type="button" class="btn btn-xs btn-note" @click="toggleCreateNew('note')">
        <i class="fa fa-fw fa-sticky-note-o" aria-hidden="true"></i>
        New Note
      </button>

      <button type="button" class="btn btn-xs btn-goal" @click="toggleCreateNew('goal')">
        <i class="fa fa-fw fa-check-square" aria-hidden="true"></i>
        New Goal
      </button> -->

      <button type="button" class="btn btn-xs btn-default" @click="toggleCreatingNewButtons">
        <i class="fa fa-fw fa-times" aria-hidden="true"></i>
      </button>
    </template>

    <form class="form-horizontal" v-if="creatingNew" @submit.prevent="submitForm">
      <div class="row">
        <div class="col-md-6">
          <!-- <input type="text" class="form-control input-sm" v-model="resource.name" v-if="creatingNew=='folder'" placeholder="Name" maxlength="255" v-focus>
          <input type="text" class="form-control input-sm" v-model="resource.title" v-else :placeholder="placeholderText" maxlength="255" v-focus> -->
          <input type="text" class="create-new-input" v-model="resource.name" v-if="creatingNew=='folder'" placeholder="Name" maxlength="255" v-focus>
          <input type="text" class="create-new-input" v-model="resource.title" v-else :placeholder="placeholderText" maxlength="255" v-focus>
        </div>

        <button type="button" class="btn btn-xs" :class="buttonClass" @click.prevent="submitForm">Create</button>
        <button type="button" class="btn btn-default btn-xs" @click="createNew(undefined)">Cancel</button>
      </div>
    </form>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
    name: 'create-new',
    data () {
        return {
            resource: {
              name: undefined,
              title: undefined,
              folder_id: Productivity.currentFolder ? Productivity.currentFolder.id : undefined
            }
        }
    },
    computed: {
      ...mapGetters([
        'currentFolder',
        'creatingNew',
        'showCreatingNewButtons',
      ]),
      buttonClass: function() {
        switch (this.creatingNew) {
          case 'list': return 'btn-list'
            break;
          default: return 'btn-folder'

        }
      },
      placeholderText: function() {
        return this.creatingNew == 'list' ? 'List title' : this.creatingNew == 'note' ? 'Note title' : this.creatingNew == 'goal' ? 'Goal title' : 'Title'
      }
    },
    methods: {
      ...mapActions([
        'storeFolder',
        'storeChecklist',
        // 'storeNote',
        // 'storeGoal',
        'createNew',
        'toggleCreatingNewButtons'
      ]),
      toggleCreateNew: function(model) {
        this.createNew(model)
      },
      submitForm: function() {

        switch (this.creatingNew) {
          case 'folder':
            this.storeFolder(this.resource).then(
              (response) => {
                this.createNew(undefined)
                this.toggleCreatingNewButtons()
                this.resetForm()
              },
              (response) => {
                alert('error creating folder')
              }
            )
            break;

          case 'list':
            this.storeChecklist(this.resource).then(
              (response) => {
                this.createNew(undefined)
                this.toggleCreatingNewButtons()
                this.resetForm()
              },
              (response) => {
                alert('error creating list')
              }
            )
            break;

          // case 'note':
          //   this.storeNote(this.resource).then(
          //     (response) => {
          //       this.createNew(undefined)
          //       this.toggleCreatingNewButtons()
          //       this.resetForm()
          //     },
          //     (response) => {
          //       alert('error creating note')
          //     }
          //   )
          //   break;
          //
          // case 'goal':
          //   this.storeGoal(this.resource).then(
          //     (response) => {
          //       this.createNew(undefined)
          //       this.toggleCreatingNewButtons()
          //       this.resetForm()
          //     },
          //     (response) => {
          //       alert('error creating goal')
          //     }
          //   )
          //   break;

        }

      },
      resetForm: function() {
        return this.resource.name = this.resource.title = undefined
      }
    }
}
</script>
