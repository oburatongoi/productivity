<template lang="html">
  <div class="move-to-checklist">
    <div class="move-to-checklist-heading">
      <mover-breadcrumbs />
      <mover-selected :parent-model="parentModel"/>
      <i class="fa close-mover-button fa-times" aria-hidden="true" v-tooltip.bottom-left="'Cancel Move'" @click="cancel"/>
    </div>

    <div class="move-to-checklist-body" @click.self="deselectMoverSelected">
      <!-- <mover-breadcrumbs /> -->

      <!-- <mover-selected :parent-model="parentModel"/> -->

      <move-target-folders v-if="moverContext=='folder'"/>

      <move-target-checklists v-if="moverContext=='folder'"/>

      <move-target-checklist-items v-if="moverContext=='checklist'"/>

      <move-target-checklist-sub-items v-if="moverContext=='checklist-item'&&openMovableChecklistItem.id"/>
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
import MoverBreadcrumbs from './MoverBreadcrumbs.vue'
import MoverSelected from './MoverSelected.vue'
import MoveTargetFolders from './MoveTargetFolders.vue'
import MoveTargetChecklists from './MoveTargetChecklists.vue'
import MoveTargetChecklistItems from './MoveTargetChecklistItems.vue'
import MoveTargetChecklistSubItems from './MoveTargetChecklistSubItems.vue'
// import MoveTargetOpenChecklistItem from './MoveTargetOpenChecklistItem.vue'

export default {
  name: 'move-to-checklist',
  components: {
    MoverBreadcrumbs,
    MoverSelected,
    MoveTargetFolders,
    MoveTargetChecklists,
    MoveTargetChecklistItems,
    MoveTargetChecklistSubItems,
    // MoveTargetOpenChecklistItem,
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
      'openMovableChecklistItem',
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
      return 'btn-list'
      // switch (this.selected.model) {
      //   case 'checklist': return 'btn-list'
      //     break;
      //   default: return 'btn-list'
      //
      // }
    },
  },
  created: function() {
    this.refreshMover()
    this.fetchInitialFoldersAndChecklists(this.openMovableFolder)
  },
  beforeDestroy: function() {
    this.resetMover()
  },
  methods: {
    ...mapActions([
      'delistChecklistItem',
      'deselect',
      'deselectMoverSelected',
      'fetchInitialFoldersAndChecklists',
      'fetchNewFoldersAndChecklists',
      'openMoverFolder',
      'removeCurrentlyEditable',
      'refreshMover',
      'resetInfoMessage',
      'resetMover',
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
    // padding: 10px;
    padding: 0;
    text-align: left;
    position: relative;
    .fa-times,
    .fa-arrow-left {
        cursor: pointer;
        &:hover {
            color: $folder-primary;
        }
    }
    .close-mover-button {
      padding: 5px;
      position: absolute;
      top: 10px;
      right: 10px;
      @include high-z-index(0);
      color: darken($base-border-color, 20%);
      background: rgba(255, 255, 255, 0.4);
      cursor: pointer;
      &:hover {
        color: $brand-danger;
      }
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
    padding: 10px 10px 80px;
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
    border-bottom: 1px solid white;
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
