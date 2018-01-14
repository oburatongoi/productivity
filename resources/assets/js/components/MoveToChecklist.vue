<template lang="html">
  <div class="move-to-checklist">
    <div class="move-to-checklist-heading">
      <template>
        <i class="fa fa-arrow-left heading-left" aria-hidden="true" @click="openFolder(openMovableFolder.folder)" v-if="openMovableFolder.folder"/>
        <i class="fa fa-arrow-left heading-left" aria-hidden="true" @click="fetchInitialFoldersAndChecklists()" v-if="openMovableFolder.id&&!openMovableFolder.folder"/>
        <span
          class="current-folder"
          v-if="openMovableFolder"
          :class="{ active: openMovableFolder.id==selectedMovableChecklist.folder_id }"
          @click.prevent="deselectMoverSelected"
        >
          <i class="fa fa-home" aria-hidden="true" v-if="!openMovableFolder.id&&!openMovableFolder.folder"/>
          {{ openMovableFolder.name }}
        </span>
      </template>

      <span class="heading-right" @click="cancel">
        <i class="fa fa-times" aria-hidden="true"/>
        Cancel Move
      </span>

    </div>

    <div class="move-to-checklist-body" @click.self="deselectMoverSelected">
      <mover-selected :parent-model="parentModel"/>

      <move-target-folders
        @openFolder="openFolder"
        v-if="moverContext=='folder'"
      />
      <move-target-checklists v-if="moverContext=='folder'||moverContext=='checklist'"/>

      <move-target-open-checklist-item v-if="moverContext=='checklist-item'"/>
    </div>

    <div class="move-to-checklist-footer">
      <template v-if="!isInSelectedChecklist&&!isSelectedChecklist">
        <button type="button"
          class="btn btn-sm"
          :class="moveButtonClass"
          v-if="selectedMovableChecklist.id||selectedMovableChecklistItem.id"
          @click.prevent="moveTo"
        >Move</button>
      </template>

      <button type="button"
              class="btn btn-sm btn-default"
              @click="cancel"
      >Cancel</button>

      <p v-if="footerText">
        <span v-if="!isInSelectedChecklist&&!isSelectedChecklist">Move to</span>
        <span class="footer-text"> {{ footerText }}</span>
      </p>
    </div>
  </div>

</template>

<script>

import { mapActions, mapGetters } from 'vuex'
import MoverSelected from './MoverSelected.vue'
import MoveTargetFolders from './MoveTargetFolders.vue'
import MoveTargetChecklists from './MoveTargetChecklists.vue'
import MoveTargetOpenChecklistItem from './MoveTargetOpenChecklistItem.vue'

export default {
  name: 'move-to-checklist',
  components: {
    MoverSelected,
    MoveTargetFolders,
    MoveTargetChecklists,
    MoveTargetOpenChecklistItem,
  },
  props: {
    replaceAfterMove: {
      type: Boolean,
      default: false
    },
    parentModel: {
      type: String,
      default: 'checklist'
    }
  },
  computed: {
    ...mapGetters([
      'editableSubItem',
      'moverContext',
      'openMovableFolder',
      'selected',
      'selectedMovableChecklist',
      'selectedMovableChecklistItem',
    ]),
    footerText: function() {
      return this.isSelectedChecklist ?
                'You can not move an item into itself' :
              this.isInSelectedChecklist ?
                'Item is already in this list' :
              this.selectedMovableChecklist.title ?
                this.selectedMovableChecklist.title :
              this.selectedMovableChecklistItem.content ?
                this.selectedMovableChecklistItem.content : null
    },
    headerText: function() {
      return this.selectedMovableChecklist && this.selectedMovableChecklist.title ? this.selectedMovableChecklist.title : 'Choose a list'
    },
    isInSelectedChecklist: function() {
      return this.selectedMovableChecklist.id && _.findIndex(this.selected.checklistItems, ['checklist_id', this.selectedMovableChecklist.id]) !== -1
          || this.selectedMovableChecklistItem.id && _.findIndex(this.selected.checklistItems, ['parent_id', this.selectedMovableChecklistItem.id]) !== -1
    },
    isSelectedChecklist: function() {
      return _.findIndex(this.selected.checklistItems, ['id', this.selectedMovableChecklistItem.id]) !== -1
    },
    moveButtonClass: function() {
      switch (this.selected.model) {
        case 'checklist': return 'btn-list'
          break;
        default: return 'btn-folder'

      }
    },
  },
  created: function() {
    this.refreshMover()
    this.fetchInitialFoldersAndChecklists(this.openMovableFolder.id)
    this.$eventHub.$on('openFolder', this.openFolder);
  },
  beforeDestroy: function() {
    this.$eventHub.$off('openFolder', this.openFolder);
    this.resetMover()
  },
  methods: {
    ...mapActions([
      'delistChecklistItem',
      'deselect',
      'fetchInitialFoldersAndChecklists',
      'fetchNewFoldersAndChecklists',
      'removeCurrentlyEditable',
      'refreshMover',
      'resetInfoMessage',
      'resetMover',
      'deselectMoverSelected',
      'setInfoMessage',
      'setMoverVariable',
      'toggleMovable',
      'toggleMoverVariable',
      'updateChecklistItem',
    ]),
    cancel: function() {
      return this.toggleMovable()
    },
    handleSuccessfulMove: function(response) {
      if (
        response.list_type == 'ta' // if the target checklist is a task list
        && this.replaceAfterMove //  and replace-after-move prop is set to true
        || response.switchParent //  and replace-after-move prop is set to true
      ) {
        for (var i = 0; i < response.selected.checklistItems.length; i++) {
          this.updateChecklistItem( response.selected.checklistItems[i] )
              .then( item => this.deselect( { model: 'checklist-item', listing: item.old } ) )
              .catch( error => console.log(error) )
        }
      } else {

        // WIP: ensure subItems are covered

        if (this.selected.checklistItems && this.selected.checklistItems.length) {
          for (var i = 0; i < this.selected.checklistItems.length; i++) {
            this.delistChecklistItem(this.selected.checklistItems[i])
                .then( checklistItem => this.deselect( {model: 'checklist-item', listing: checklistItem }) )
                .catch( response => {console.log('error delisting item');console.log(response);} )
          }
        }

      }

      this.removeCurrentlyEditable({ parentModel: this.parentModel })
    },
    moveTo: function() {
      var isSubItem = !! this.selectedMovableChecklistItem.checklist_id,
          route = isSubItem && this.selectedMovableChecklistItem.id ?
                    '/move-to-checklist-item/'+this.selectedMovableChecklistItem.id :
                    '/move-to-checklist/'     +this.selectedMovableChecklist.fake_id
      axios.patch(route, {selected: {checklistItems: this.selected.checklistItems} })
           .then( response => response.data.success ? this.handleSuccessfulMove(response.data) : console.log('Error moving (1)') )
           .catch( response => console.log(response) )
    },
    openFolder: function(folder) {
      return this.fetchNewFoldersAndChecklists(folder)
    },
  },
}
</script>

<style lang="scss">
.move-to-checklist {
    background: white;
    border: 1px solid $base-border-color;
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    padding: 0;
    @include high-z-index(2);
    height: 100%;

}
.move-to-checklist-heading {
    background: $body-bg;
    border-bottom: 1px solid $base-border-color;
    padding: 10px;
    text-align: left;
    position: relative;
    .fa-times,
    .fa-arrow-left {
        cursor: pointer;
        &:hover {
            color: $folder-primary;
        }
    }
    .heading-right {
        // float: right;
        // margin-top: 5px;
        position: absolute;
        top: 15px;
        right: 10px;
        @include high-z-index(0);
        cursor: pointer;
    }
    .heading-left {
        float: left;
        margin-top: 5px;
    }
    &:after {
        content: "";
        display: block;
        clear: both;
    }
    .current-folder {
        margin-left: 10px;
        font-size: 1.2em;
        cursor: default;
        &.active {
            color: $folder-primary
        }
    }
}

.move-to-checklist-body {
    height: 85%;
    overflow-x: hidden;
    // padding: 10px 10px 10px 30px;
    padding: 10px 20px;
    position: relative;
    @include desktop-overflow-y-scroll;
    .info-message {
        .fa-spin {
            color: $folder-primary;
        }
        .error {
            color: $brand-warning;
        }
        .info {
            color: $brand-info;
        }
    }
}

.move-target-checklist-sub-items,
.move-target-open-checklist-item,
.move-to-checklist-body {
  .nested-checklist-item,
  .nested-checklist,
  .nested-folder {
      display: block;
      padding: 5px 5px 0px;
      border-radius: 3px;
      cursor: default;
      .fa-angle-right {
          float: right;
          cursor: pointer;
          padding: 3px 8px;
          border: 1px solid transparent;
          display: none;
          &:hover {
              border: 1px solid;
              border-radius: 3px;
          }
      }
      &:hover {
          background: lighten($body-bg, 0.5%);
          .fa-angle-right {
              display: inline-block;
          }
      }
      span {
          display: inline-block;
          width: 93%;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          margin: 0;
          padding: 0;
          line-height: 1.5;
      }

  }
  .nested-folder {
    cursor: pointer;
      .fa {
          color: $folder-primary;
      }
      &.active {
          color: $folder-primary;
          border: 1px dotted $folder-primary;
      }
  }

  .nested-checklist-item,
  .nested-checklist {
    &.opened {
      padding-bottom: 5px;
      background: lighten($body-bg, 0.5%);
    }
  }
}

.move-to-checklist-body {
  .nested-checklist-item,
  .nested-checklist {
      .fa {
          color: $list-primary;
      }
      &.active:not(.opened) {
          color: $list-primary;
          border: 1px dotted $list-primary;
      }
  }
}

.move-to-checklist-footer {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    // border-top: 1px solid $base-border-color;
    padding: 10px;
    @include transparent-linear-gradient;
    p {
        margin: 0;
        margin-left: 10px;
        font-size: 0.8em;
        display: inline-block;
        span.footer-text {
            color: $list-primary;
            font-weight: 600;
        }
    }
    .toggle-add-folder-btn {
        float: right;
        cursor: pointer;
        margin-top: 8px;
        .fa-folder {
            font-size: 1.5em;
            line-height: 16px;
        }
        .fa-times,
        .fa-plus {
            font-size: 0.7em;
            line-height: 18px;
        }
    }
}

</style>
