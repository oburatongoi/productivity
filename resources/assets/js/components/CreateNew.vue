<template lang="html">
  <div>

    <div class="form-group">
      <button type="button" class="btn btn-sm btn-primary" v-if="!showButtons" @click="toggleButtons">New</button>

      <template v-if="showButtons&&!creatingNew">
        <button type="button" class="btn btn-sm btn-primary" @click="toggleCreateNew('folder')">
          <i class="fa fa-fw fa-folder" aria-hidden="true"></i>
          Folder
        </button>

        <button type="button" class="btn btn-sm btn-list" @click="toggleCreateNew('list')">
          <i class="fa fa-fw fa-list" aria-hidden="true"></i>
          List
        </button>

        <button type="button" class="btn btn-sm btn-note" @click="toggleCreateNew('note')">
          <i class="fa fa-fw fa-sticky-note-o" aria-hidden="true"></i>
          Note
        </button>

        <button type="button" class="btn btn-sm btn-goal" @click="toggleCreateNew('goal')">
          <i class="fa fa-fw fa-check-square" aria-hidden="true"></i>
          Goal
        </button>

        <button type="button" class="btn btn-sm btn-default" @click="toggleButtons">Cancel</button>
      </template>

    </div>

    <template v-if="creatingNew">
      <div class="form-group">
          <input type="text" class="form-control" ref="nameInput" v-model="resource.name" v-if="creatingNew=='folder'" placeholder="Name" @keyup.enter="submitForm">
          <input type="text" class="form-control" ref="titleInput" v-model="resource.title" v-else placeholder="Title" @keyup.enter="submitForm">
      </div>

      <div class="form-group">
          <button type="button" class="btn btn-default btn-sm" @click="createNew(undefined)">Cancel</button>
          <button type="button" class="btn btn-primary btn-sm" @click="submitForm">Create</button>
      </div>
    </template>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
    name: 'folders-create',
    data () {
        return {
            resource: {
              name: undefined,
              title: undefined,
              folder_id: this.currentFolder ? this.currentFolder.id : undefined
            }
        }
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
        console.log(this.$refs);
        this.$nextTick(function () {
          console.log(this.$refs);
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
          this.createNew(model)

        })
        // switch (model) {
        //   case 'folder':
        //     this.$nextTick(function () {
        //       this.$refs.nameInput.focus()
        //     })
        //     break;
        //
        //     default:
        //     this.$nextTick(function () {
        //       this.$refs.titleInput.focus()
        //     })
        //
        // }
        // this.createNew(model)
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
    },
    computed: {
      ...mapGetters([
        'currentFolder',
        'creatingNew',
        'showButtons',
      ])
    }
}
</script>
