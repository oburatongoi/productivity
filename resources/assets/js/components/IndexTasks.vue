<template>
  <div class="index-tasks" :class="taskClass">
    <div class="panel main-panel">
      <div class="home-body panel-body">
        <ul
          class="list-unstyled checklist-items"
          v-if="checklistItems.length"
        >
            <checklist-item
              v-for="item in checklistItems"
              :item="item"
              type="ta"
              :key="item.id"
              :parent-model="'checklist'"
              @onEmitClick="toggleSelection"
            />

            <li v-if="!checklistItems.length">There are no pending tasks at this time.</li>
        </ul>
      </div>
    </div>

    <checklist-item-tree
      v-if="editableSubItem.id"
      :item="editableItem"
      :checklist="editableItem.checklist"
      :folder="editableItem.checklist.folder"
      parent-component="index-tasks"
      @onSelection="toggleSelection"
    />

    <edit-checklist-item
      v-if="editableItem.id"
      :list-type="'ta'"
      :item="editableItem"
      parent-model="checklist"
    />

    <edit-checklist-item
      v-if="editableSubItem.id"
      :list-type="'ta'"
      :item="editableSubItem"
      parent-model="checklist-item"
    />
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

import ChecklistItem from './ChecklistItem.vue'
import ChecklistItemTree from './ChecklistItemTree.vue'
import EditChecklistItem from './EditChecklistItem.vue'

export default {
  name: 'index-tasks',
  components: {
      ChecklistItem,
      ChecklistItemTree,
      EditChecklistItem
  },
  computed: {
    ...mapGetters([
      'checklistItems',
      'editableItem',
      'editableSubItem',
      'editableItemIsExpanded',
      'editableSubItemIsExpanded'
    ]),
    taskClass: function() {
      return  this.editableSubItemIsExpanded ? 'has-expanded-editable-sub-item':
              this.editableSubItem.id        ? 'has-editable-sub-item'         :
              this.editableItemIsExpanded    ? 'has-expanded-editable-item'    :
              this.editableItem.id           ? 'has-editable-item'             :
                                                null                           ;
    }
  },
  created: function() {
    this.$eventHub.$on('debounceResizeInput', this.debounceResizeInput);
    this.$eventHub.$on('toggleSelection', this.toggleSelection);
  },
  beforeDestroy: function() {
    this.$eventHub.$off('debounceResizeInput', this.debounceResizeInput);
    this.$eventHub.$off('toggleSelection', this.toggleSelection);
  },
  methods: {
    ...mapActions([
      'toggleSelection'
    ])
  },
}
</script>

<style lang="scss">
.index-tasks {
    height: 100%;
    @include desktop-overflow-y;

    .main-panel {
        height: 100%;
        @include desktop-overflow-y;
        .panel-heading {
            padding-bottom: 0;
        }
    }

    .side-panel {
        @include desktop-overflow-y;
        height: 100%;
    }

    .home-body {
        height: 100%;
        overflow-y: scroll;
        padding-top: 0;
    }

    .show-item-content-input,
    .show-item-content {
        font-weight: $font-weight-normal;
        color: $grey-text-color;
    }

    &.has-expanded-editable-item {
        .main-panel {
            display: none;
        }

        .side-panel {
            width: 100%;
        }
    }

    &.has-expanded-editable-sub-item {
      .side-panel.checklist-item-tree,
      .side-panel.checklist-item,
      .main-panel {
          display: none;
      }

      .side-panel.sub-checklist-item {
          width: 100%;
      }
    }

    &.has-editable-sub-item,
    &.has-editable-item {
      @media(min-width:769px){
          .main-panel,
          .side-panel {
              display: inline-block;
              vertical-align: top;
          }
        }

        .show-item-content-input,
        .show-item-content {
            width: 60%;
            font-size: 0.9em;
            line-height: 1.2;
            @media(min-width:768px){
                width: 50%;
                padding: 5px 0;
            }
            @media(min-width:992px){
                width: 50%;
                padding: 7px 0;
                font-size: 1em;
                line-height: 0.7em;
                white-space: nowrap;
                @include desktop-overflow-y;
                text-overflow: ellipsis;
            }
            @media(min-width:1200px){
                width: 60%;
                padding: 10px 0;
                font-size: 1.1em;
                line-height: 1em;
            }
            @media(min-width:1400px){
                width: 60%;
            }
        }

        .show-item-content-input {
            border: 0;
            outline: none;
        }
    }

    &.has-editable-item {
        @media(max-width:768px){
            .main-panel {
                display: none;
            }
            .side-panel {
                position: absolute;
                top: 56px;
                left: 10px;
                right: 10px;
                width: auto;
            }
        }

        @media(min-width:769px){
            .main-panel {
                width: 40%;
            }
            .side-panel {
                width: 58%;
                margin-left: 1%;
            }
        }

        @media(min-width:1200px){
            .main-panel {
                width: 45%;
            }
            .side-panel {
                width: 53%;
                margin-left: 1%;
            }
        }
    }

    &.has-editable-sub-item {
      .side-panel.checklist-item,
      .main-panel {
          display: none;
      }
        @media(max-width:768px){
            .side-panel.checklist-item-tree {
                display: none;
            }
            .side-panel.sub-checklist-item {
                position: absolute;
                top: 56px;
                left: 10px;
                right: 10px;
                width: auto;
            }
        }

        @media(min-width:769px){
            .side-panel.checklist-item-tree {
                width: 40%;
            }
            .side-panel.sub-checklist-item {
                width: 58%;
                margin-left: 1%;
            }
        }

        @media(min-width:1200px){
            .side-panel.checklist-item-tree {
                width: 45%;
            }
            .side-panel.sub-checklist-item {
                width: 53%;
                margin-left: 1%;
            }
        }
    }

    .edit-checklist-btn,
    .edit-checklist-icon {
        float: right;
    }
    .edit-checklist-btn {
        margin-top: 5px;
    }

    .edit-checklist-icon {
        margin-top: 8px;
        margin-left: 5px;
        font-size: 0.6em;
        cursor: pointer;
        color: $input-border;
        &.fa-circle-o-notch,
        &:hover {
            color: $brand-primary;
        }
    }

    .checklist-title span,
    .checklist-title .fa-list,
    .edit-checklist-input {
        vertical-align: text-top;
    }

    .checklist-title,
    .edit-checklist-input {
        font-weight: $font-weight-normal;
        font-family: $title-font-family;
    }
    .checklist-title span,
    .checklist-title .fa-list,
    .edit-checklist-input {
        line-height: 1.2;
        font-size: 1.25em;
    }
    .checklist-title span,
    .edit-checklist-input {
        width: 85%;
        padding: 0;
        margin:0;
    }


    .checklist-title  span{
        display: inline-block;
    }

    .checklist-title {
        color: $blue-text-color;
    }

    .edit-checklist-input {
        border: 0;
        color: $grey-text-color;
        outline: none;
    }
}

</style>
