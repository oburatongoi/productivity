<template lang="html">

  <div class="create-new">

    <template v-if="showCreatingNewButtons&&!creatingNew">
      <button type="button" class="btn btn-sm btn-primary" @click="toggleCreateNew('folder')">
        <i class="fa fa-fw fa-folder" aria-hidden="true"/>
        Folder
      </button>

      <button type="button" class="btn btn-sm btn-list" @click="toggleCreateNew('list')">
        <i class="fa fa-fw fa-list" aria-hidden="true"/>
        List
      </button>

      <!-- <button type="button" class="btn btn-sm btn-note" @click="toggleCreateNew('note')">
        <i class="fa fa-fw fa-sticky-note-o" aria-hidden="true"/>
        New Note
      </button>

      <button type="button" class="btn btn-sm btn-goal" @click="toggleCreateNew('goal')">
        <i class="fa fa-fw fa-check-square" aria-hidden="true"/>
        New Goal
      </button> -->

      <button type="button" class="btn btn-sm btn-default" @click="toggleCreatingNewButtons">
        <i class="fa fa-fw fa-times" aria-hidden="true"/>
      </button>
    </template>

    <form class="create-new-form" v-if="creatingNew" @submit.prevent="submitForm">
      <div class="row">
        <div class="input-wrap col-md-6">
          <input type="text" class="create-new-input" v-model="resource.name" v-if="creatingNew=='folder'" placeholder="Name" maxlength="255" v-focus>
          <input type="text" class="create-new-input" v-model="resource.title" v-else :placeholder="placeholderText" maxlength="255" v-focus>
        </div>

        <div class="button-wrap col-md-6">
          <button type="button" class="btn btn-sm" :class="buttonClass" @click.prevent="submitForm">Create</button>
          <button type="button" class="btn btn-default btn-sm" @click="createNew(undefined)">Cancel</button>
        </div>
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
              folder_id: Productivity.currentFolder ? Productivity.currentFolder.id : {}
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
