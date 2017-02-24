<template lang="html">

  <div class="top-padding">
    <button type="button" class="btn btn-sm btn-primary" v-if="!showButtons" @click="toggleButtons">New</button>

    <template v-if="showButtons&&!creatingNew">
      <button type="button" class="btn btn-sm btn-primary" @click="toggleCreateNew('folder')">
        <i class="fa fa-fw fa-folder" aria-hidden="true"></i>
        New Folder
      </button>

      <button type="button" class="btn btn-sm btn-list" @click="toggleCreateNew('list')">
        <i class="fa fa-fw fa-list" aria-hidden="true"></i>
        New List
      </button>

      <button type="button" class="btn btn-sm btn-note" @click="toggleCreateNew('note')">
        <i class="fa fa-fw fa-sticky-note-o" aria-hidden="true"></i>
        New Note
      </button>

      <button type="button" class="btn btn-sm btn-goal" @click="toggleCreateNew('goal')">
        <i class="fa fa-fw fa-check-square" aria-hidden="true"></i>
        New Goal
      </button>

      <button type="button" class="btn btn-sm btn-default" @click="toggleButtons">Cancel</button>
    </template>

    <form class="form-horizontal" v-if="creatingNew" @submit.prevent="submitForm">
      <div class="col-md-6">
          <input type="text" class="form-control input-sm" ref="nameInput" v-model="resource.name" v-if="creatingNew=='folder'" placeholder="Name" maxlength="255">
          <input type="text" class="form-control input-sm" ref="titleInput" v-model="resource.title" v-if="creatingNew=='note'" placeholder="Note Title" maxlength="255">
          <input type="text" class="form-control input-sm" ref="titleInput" v-model="resource.title" v-if="creatingNew=='goal'" placeholder="Goal Title" maxlength="255">
          <input type="text" class="form-control input-sm" ref="titleInput" v-model="resource.title" v-if="creatingNew=='list'" placeholder="List Title" maxlength="255">
      </div>

      <button type="button" class="btn btn-primary btn-sm" @click.prevent="submitForm">Create</button>
      <button type="button" class="btn btn-default btn-sm" @click="createNew(undefined)">Cancel</button>
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
        'showButtons',
      ])
    },
    methods: {
      ...mapActions([
        'storeFolder',
        'storeChecklist',
        'storeNote',
        'createNew',
        'toggleButtons'
      ]),
      toggleCreateNew: function(model) {
        this.createNew(model)
        switch (model) {
          case 'folder':
            this.$nextTick(function () {
              this.$refs.nameInput.focus()
            })
            break;

            default:
            this.$nextTick(function () {
              this.$refs.titleInput.focus()
            })

        }
      },
      submitForm: function() {

        switch (this.creatingNew) {
          case 'folder':
            this.storeFolder(this.resource).then(
              (response) => {
                this.createNew(undefined)
                this.toggleButtons()
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
                this.toggleButtons()
                this.resetForm()
              },
              (response) => {
                alert('error creating list')
              }
            )
            break;

          case 'note':
            this.storeNote(this.resource).then(
              (response) => {
                this.createNew(undefined)
                this.toggleButtons()
                this.resetForm()
              },
              (response) => {
                alert('error creating note')
              }
            )
            break;

        }

      },
      resetForm: function() {
        return this.resource.name = this.resource.title = undefined
      }
    }
}
</script>
