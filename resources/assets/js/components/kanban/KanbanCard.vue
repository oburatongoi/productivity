<template lang="html">
  <li
  class="kanban-card"
  :class="[{ expanded: card.isExpanded }, card.model]" >
    <div
    class="kanban-card-heading"
    :class="card.model" >

      <i
      class="fas fa-fw fa-folder"
      aria-hidden="true"
      v-if="card.model=='folder'" />

      <i
      class="far fa-fw"
      :class="checklistIconClass"
      aria-hidden="true"
      v-if="card.model=='checklist'" />

      {{ card.name || card.title | truncate(truncateLength) }}

      <span class="kanban-card-heading-icons">
        <i
        class="far fa-fw kanban-card-heading-icon"
        :class="expansionClass"
        aria-hidden="true"
        title="expand/shrink"
        @click.stop="toggleKanbanExpansion(card)" />

        <i
        class="far fa-fw fa-arrow-circle-right kanban-card-heading-icon"
        aria-hidden="true"
        :title="'Navigate to '+ (card.name || card.title)"
        @click.stop="navigateToNestedKanban(card)" />
      </span>

    </div>

    <ul class="kanban-card-body">

      <template v-if="card.subfolders">

        <kanban-folder
        v-for="folder in card.subfolders"
        :key="folder.id"
        :truncate-length="truncateLength"
        :folder="folder" />

      </template>

      <template v-if="card.checklists">

        <kanban-checklist
        v-for="checklist in card.checklists"
        :key="checklist.id"
        :truncate-length="truncateLength"
        :checklist="checklist" />

      </template>

      <template v-if="card.model=='checklist'">

        <template v-if="hasSections">
          <kanban-section
          v-for="section in card.sections"
          :key="section.id"
          :section="section"
          :truncate-length="truncateLength"
          :parent="card" />

          <kanban-section
          :section="defaultSection"
          :parent="card"
          :truncate-length="truncateLength"
          v-if="defaultSection" />
        </template>

        <template v-if="hasItems&&!hasSections">
          <kanban-checklist-item
          v-for="item in card.items"
          :key="'item'+item.id"
          :item="item"
          :truncate-length="truncateLength"
          :list-type="card.list_type" />

          <add-item-lite :parent="card" />

          <add-section :parent="card" />
        </template>

        <template v-if="!hasItems&&!hasSections">
          <add-item-lite :parent="card" />

          <add-section :parent="card" />
        </template>

      </template>

    </ul>

    <div
    class="kanban-card-footer"
    v-if="card.model=='folder'" >

      <kanban-adder :parent="card" />

    </div>

  </li>

</template>

<script>
import { mapActions } from 'vuex'
import AddItemLite from '../AddItemLite.vue'
import AddSection from '../AddSection.vue'
import KanbanAdder from './KanbanAdder.vue'
import KanbanChecklist from './KanbanChecklist.vue'
import KanbanChecklistItem from './KanbanChecklistItem.vue'
import KanbanFolder from './KanbanFolder.vue'
import KanbanSection from './KanbanSection.vue'
export default {
  name: 'kanban-card',
  components: {
      AddItemLite,
      AddSection,
      KanbanAdder,
      KanbanChecklist,
      KanbanChecklistItem,
      KanbanFolder,
      KanbanSection
  },
  props: {
    card: {
      type: Object,
      required: true
    }
  },
  computed: {
    checklistIconClass: function() {
    return this.card.model != 'checklist' ? null              :
           ! this.card.list_type          ? 'fa-list'         :
             this.card.list_type == 'ch'  ? 'fa-list'         :
             this.card.list_type == 'ta'  ? 'fa-tasks' :
             this.card.list_type == 'bu'  ? 'fa-list-ul'      :
             this.card.list_type == 'nu'  ? 'fa-list-ol'      :
                                                'fa-list'     ;
    },
    defaultSection: function() {
      if (this.hasItems && this.hasSections) {
        return {
          title: 'Unsectioned Items',
          items: this.card.items,
          model: this.card.model,
          id: this.card.id,
          list_type: this.card.list_type
        }
      }
      return null
    },
    draggableClass: function() {
      switch (this.card.model) {
        case 'folder':
          return 'enfoldable'
          break;
        case 'checklist':
          return 'enlistable'
          break;
        case 'checklist-item':
          return 'sub-enlistable'
          break;
        default: return 'draggable'

      }
    },
    expansionClass: function() {
      return this.card.isExpanded ? 'fa-compress-alt' : 'fa-expand-alt'
    },
    hasSections: function() {
      return this.card.sections && !! this.card.sections.length
    },
    hasItems: function() {
      return this.card.items && !! this.card.items.length
    },
    truncateLength: function() {
      return this.card.isExpanded ? 100 : 40
    },
  },
  methods: {
    ...mapActions([
      'navigateToNestedKanban',
      'toggleKanbanExpansion',
    ]),
  },
}
</script>

<style lang="scss">
  .kanban-card {
    background: white;
    border: 1px solid $base-border-color;
    border-radius: 4px;
    min-width: 400px;
    max-width: 800px;
    display: inline-block;
    margin-left: 20px;
    height: auto;
    vertical-align: top;
    overflow: hidden;
    position: relative;

    -webkit-box-shadow: -0 5px 5px -5px darken($base-border-color, 10%);
            box-shadow: -0 5px 5px -5px darken($base-border-color, 10%);

    &:last-child {
      margin-right: 20px;
    }

    &.expanded {
      min-width: 660px;
    }

    .kanban-card-heading-icons {
      opacity: 0;
      right: 10px;
      top: 10px;
      position: absolute;
    }

    &:hover {
      .kanban-card-heading-icons {
        opacity: 1;
      }
    }

    .kanban-card-heading-icon {
      color: $base-border-color;
      cursor: pointer;
      &:hover {
        color: darken($base-border-color, 20%);
      }
      &:not(:last-child) {
        margin-right: 5px;
      }
    }

    .kanban-card-heading {
      background: white;
      position: relative;
    }

    .kanban-card-body {
      height: auto;
      min-height: 2px;
      border-top: 1px solid $base-border-color;
      overflow-y: scroll;
      &,
      ul {
        min-height: 2px;
        display: block;
        margin: 0;
      }

      &.folder {
        ul {
          padding: 10px 0 0;
          margin: 0;
        }
      }

      &.checklist {
        ul {
          padding: 0;
          margin: 0;
        }
      }
    }

    .kanban-card-heading,
    .kanban-card-body,
    .kanban-card-footer {
      padding: 10px;
    }
    .kanban-card-body {
      padding-bottom: 53px;
    }

    .kanban-card-footer {
      border-top: 1px dashed $base-border-color;
      background: white;
      position: absolute;
      padding: 5px;
      bottom: 0;
      left: 0;
      right: 0;
    }

    .nested-kanban-card {
      display: block;
      width: 100%;
      color: black;
      position: relative;

      &.folder,
      &.checklist,
      &.checklist-item,
      &.sub-checklist-item {
        padding: 3px 0 3px 5px;
        background: white;
        margin-bottom: 2px;
        border: 1px solid white;

        &:hover {
          border-top: 1px dotted $base-border-color;
          border-bottom: 1px dotted $base-border-color;
          border-radius: 0px;
          // background: $body-bg;
        }

        &.selected,
        &.opened {
          background: $body-bg;
          border-radius: 3px;
        }

        &.opened {
          border: 1px solid $base-border-color;
          border-radius: 0;
          padding: 0;
          margin-bottom: 10px;

          & > .nested-kanban-card-heading {
            background: $body-bg;
            padding: 3px 10px;
          }

          & > .nested-kanban-card-body {
            border-top: 1px solid $base-border-color;
            background: white;
            padding: 10px;
          }
          & > .nested-kanban-card-footer {
            border-top: 1px dashed $base-border-color;
            background: white;
            padding: 0;
          }
        }
      }

      &.folder,
      &.checklist,
      &.checklist-item,
      &.sub-checklist-item {
        cursor: default;
      }

      &.folder.selected {
        border: 1px solid $folder-primary;
      }

      &.sub-checklist-item.selected,
      &.checklist-item.selected,
      &.checklist.selected {
        border: 1px solid $list-primary;
      }

      .nested-kanban-card-icon {
        // font-size: 0.8em;
        font-size: 1em;
        // color: darken($base-border-color, 20%);
        color: darken($base-border-color, 10%);
      }

      .nested-kanban-card-icon {
        color: darken($base-border-color, 10%);
        // font-size: 0.8em;
        font-size: 1em;
        cursor: pointer;
        padding: 5px;

        &:hover {
          color: darken($base-border-color, 20%);
        }
      }

      .nested-kanban-card-icons {
        position: absolute;
        right: 0;
        padding-right: 5px;

        // .folder &,
        // .checklist & {
        //   top: 12px;
        // }

        .folder &,
        .checklist &,
        .checklist-item &,
        .sub-checklist-item & {
          top: 6px;
        }

        & .fa-times,
        & .fa-chevron-up,
        & .fa-chevron-down {
          margin-right: 5px;
        }
      }

      /* Buttons */
      & > .nested-kanban-card-heading > .nested-kanban-card-icons > .nested-kanban-card-icon {
        opacity: 0;
      }
      &.opened > .nested-kanban-card-heading > .nested-kanban-card-icons > .nested-kanban-card-icon,
      &:hover > .nested-kanban-card-heading > .nested-kanban-card-icons > .nested-kanban-card-icon {
        opacity: 1;
      }

      & > .nested-kanban-card-heading > .nested-kanban-card-icon {
        opacity: 0;
      }
      &:hover > .nested-kanban-card-heading > .nested-kanban-card-icon {
        opacity: 1;
      }
      /* End Buttons */

      /* Background */
      & > .nested-kanban-card-heading > .nested-kanban-card-icons {
        background: rgba(255, 255, 255, 1);
      }
      &.selected > .nested-kanban-card-heading > .nested-kanban-card-icons,
      &.opened > .nested-kanban-card-heading > .nested-kanban-card-icons {
      // &:hover > .nested-kanban-card-heading > .nested-kanban-card-icons {
        background: rgba(245, 248, 250, 1);
      }
      /* End Background */
    }

    .folder .fa-folder {
      color: $folder-primary;
    }

    .sub-checklist-item .fa-tasks,
    .sub-checklist-item .fa-list-ul,
    .sub-checklist-item .fa-list-ol,
    .sub-checklist-item .fa-list,
    .checklist-item .fa-tasks,
    .checklist-item .fa-list-ul,
    .checklist-item .fa-list-ol,
    .checklist-item .fa-list,
    .checklist .fa-tasks,
    .checklist .fa-list-ul,
    .checklist .fa-list-ol,
    .checklist .fa-list {
      color: $list-primary;
    }

    .info-message {
      color: $light-grey-text-color;
      font-size: 0.9em;
    }

    .loading-icon {
      color: $base-border-color;
    }
  }

  .close-nested-kanban {
    color: darken($base-border-color, 10%);
    font-size: 1em;
    cursor: pointer;
    display: inline-block;
    padding-right: 10px !important;
    // margin-left: -10px;
    margin-right: 5px;
    border-right: 1px solid $base-border-color;
    & > span {
      color: darken($base-border-color, 20%);
    }
  }

  // .molly-drag-handle {
  //   color: lighten($base-border-color, 5%);
  //   font-size: 0.9em;
  //   padding: 0 3px;
  //   cursor: move !important;
  //
  //   &:hover {
  //     color: darken($base-border-color, 5%);
  //   }
  //
  //   .far, .fas, .fal {
  //     cursor: move !important;
  //     padding: 0;
  //     &:last-child {
  //       margin-left: -2px;
  //     }
  //   }
  //
  //   .molly-drag-handle-target > .molly-drag-handle-container > & { opacity: 0; }
  //   .molly-drag-handle-target:hover > .molly-drag-handle-container > & { opacity: 1; }
  // }
</style>
