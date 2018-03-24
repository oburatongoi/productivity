<template lang="html">

  <div class="create-new">

    <div class="create-new-inner">
      <div class="create-new-header">
        <h4>
          <i class="fal fa-fw" :class="createNewIcon" aria-hidden="true"/>
          <br>
          {{ createNewText }}
        </h4>

        <hr>
      </div>

      <div class="create-new-options" v-if="showCreatingNewButtons&&!creatingNew">
        <span class="create-folder" @click="toggleCreateNew('folder')">
          <i class="fas fa-fw fa-folder" aria-hidden="true"/>
          Folder
        </span>

        <span class="create-list" @click="toggleCreateNew('list')">
          <i class="far fa-fw fa-list" aria-hidden="true"/>
          List
        </span>

        <span class="cancel-create" @click="toggleCreatingNewButtons">
          <i class="far fa-fw fa-times" aria-hidden="true"/>
          Cancel
        </span>
      </div>

      <div class="create-new-form" v-if="creatingNew">
        <form @submit.prevent="submitForm" autocomplete="off">

          <div class="input-wrap">
            <input type="text" class="create-new-input" v-model="nameOrTitle" :placeholder="placeholderText" maxlength="255" v-focus>
          </div>

          <div class="add-to">
            Add to: <i class="fas fa-fw" :class="addToIcon" aria-hidden="true"/> {{ currentFolder.name || 'Home' }}
          </div>

          <div class="button-wrap">
            <button type="button" class="btn btn-sm" :class="buttonClass" @click.prevent="submitForm">Create</button>
            <button type="button" class="btn btn-default btn-sm" @click="cancel">Cancel</button>
          </div>

        </form>
      </div>
    </div>

  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'create-new',
  data () {
    return {
      nameOrTitle: undefined,
    }
  },
  computed: {
    ...mapGetters([
      'currentFolder',
      'creatingNew',
      'showCreatingNewButtons',
    ]),
    addToIcon: function() {
      return this.currentFolder.id ? 'fa-folder' : 'fa-home'
    },
    createNewIcon: function() {
      return this.creatingNew == 'list' ? 'fa-list' : this.creatingNew == 'folder' ? 'fa-folder' : 'fa-plus'
    },
    createNewText: function() {
      return this.creatingNew == 'list' ? 'CREATE LIST' : this.creatingNew == 'folder' ? 'CREATE FOLDER' : 'CREATE NEW'
    },
    buttonClass: function() {
      switch (this.creatingNew) {
        case 'list': return 'btn-list'
          break;
        default: return 'btn-folder'

      }
    },
    placeholderText: function() {
      return this.creatingNew == 'list' ? 'List title' : this.creatingNew == 'folder' ? 'Folder name' : 'Name'
    }
  },
  methods: {
    ...mapActions([
      'addChecklist',
      'addFolder',
      'storeFolder',
      'storeChecklist',
      'createNew',
      'toggleCreatingNewButtons'
    ]),
    cancel: function() {
      this.createNew(undefined)
      this.resetForm()
    },
    toggleCreateNew: function(model) {
      this.createNew(model)
    },
    submitForm: function() {

      let resource = {
        folder_id: this.currentFolder.id || null
      }

      switch (this.creatingNew) {
        case 'folder':
          resource.name = this.nameOrTitle
          this.storeFolder(resource)
              .then( (folder) => {
                  this.addFolder(folder)
                  this.createNew(undefined)
                  this.toggleCreatingNewButtons()
                  this.resetForm()
                })
              .catch( (error) => console.log('error creating folder') )
          break;

        case 'list':
        resource.title = this.nameOrTitle
          this.storeChecklist(resource)
              .then( (checklist) => {
                this.addChecklist(checklist)
                this.createNew(undefined)
                this.toggleCreatingNewButtons()
                this.resetForm()
              })
              .catch( (error) => console.log('error creating list') )
          break;

      }

    },
    resetForm: function() {
      this.nameOrTitle = undefined
    }
  }
}
</script>

<style lang="scss">
.create-new {
    // display: block;
    width: 100%;
    position: absolute;
    height: 100%;
    top: 0;
    right: 81px;
    left: 0;
    bottom: 0;
    background: rgba(255,255,255,1);
    @include high-z-index(3);
    padding: 20px;

    display: -webkit-box;
    display: -moz-box;
    display: -ms-flexbox;
    display: -webkit-flex;
    display: flex;
    align-items: center;
    justify-content: center;

    .create-new-inner {
      text-align: center;
      width: 100%;

      h4 {
        margin-bottom: 10px;
        color: darken($base-border-color, 15%);
        i {
          font-size: 2.5em;
          margin-bottom: 10px;
        }
      }

      hr {
        width: 100px;
        height: 1px;
        border: 0;
        border-top: 1px solid $base-border-color;
        padding: 0;
      }

      .create-new-options,
      .create-new-form {
        height: 300px;
        width: 100%;
      }

      .create-new-options {
        padding-top: 30px;

        & > span {
          border-bottom: 2px solid white;
          font-size: 1.2em;
          cursor: pointer;

          &:hover {
            border-bottom: 2px solid;
          }

          &:not(:first-child) {
            margin-right: 20px;
          }

          &:not(:last-child) {
            margin-left: 20px;
          }

          &.create-folder {
            color: $brand-primary;
          }

          &.create-list {
            color: $list-primary;
          }

          &.cancel-create {
            color: darken($base-border-color, 15%);
          }
        }
      }

    }
}

.create-new-input {
    border: 0;
    // border-right: 1px solid $base-border-color;
    outline: none;
    background: white;
    display: block;
    line-height: 2;
    font-size: 1.5em;
    text-align: center;
    &:active {
        outline: none;
    }
    @media(min-width:768px){
        width: 100%;
    }
}

.create-new-form {
    .input-wrap {
        margin-bottom: 60px;
    }
    .button-wrap {
      button {
        padding-left: 40px;
        padding-right: 40px;
        margin-left: 5px;
        margin-right: 5px;
      }
    }
}

.add-to {
  margin-bottom: 20px;
  color: $grey-text-color;
}

</style>
