<template lang="html">
  <li
    class="kanban-card"
    :class="card.model"
  >
    <div class="kanban-card-heading" :class="card.model">
      <i class="fa fa-fw fa-folder" aria-hidden="true" v-if="card.model=='folder'"/>
      <i class="fa fa-fw fa-list" aria-hidden="true" v-if="card.model=='checklist'"/>
      {{ card.name || card.title | truncate(35) }}
    </div>

    <draggable
      class="kanban-card-body"
      :class="card.model"
      :element="'ul'"
      :options="{ draggable: '.nested-kanban-card', group: { name: 'nested-kanban-card', pull: true, put: true } }"
    >
      <template v-if="card.subfolders">
        <kanban-folder v-for="folder in card.subfolders" :key="folder.id" :folder="folder"/>
      </template>

      <template v-if="card.checklists">
        <kanban-checklist v-for="checklist in card.checklists" :key="checklist.id" :checklist="checklist"/>
      </template>

      <template v-if="card.model=='checklist'">
        <template v-if="card.sections&&card.sections.length">
          <kanban-section v-for="section in card.sections" :key="section.id" :section="section" :parent="card"/>
          <kanban-section :section="defaultSection" :parent="card" v-if="defaultSection"/>
        </template>

        <template v-if="card.items&&!card.sections">
          <kanban-checklist-item v-for="item in card.items" :key="'item'+item.id" :item="item"/>
          <add-item-lite :parent="card"/>
          <add-section :parent="card"/>
        </template>

        <template v-if="!card.items&&!card.sections">
          <add-item-lite :parent="card"/>
          <add-section :parent="card"/>
        </template>
      </template>
    </draggable>

    <div class="kanban-card-footer" v-if="card.model=='folder'">
      <kanban-adder :parent="card"/>
    </div>
  </li>
</template>

<script>
import AddItemLite from './AddItemLite.vue'
import AddSection from './AddSection.vue'
import Draggable from 'vuedraggable'
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
      Draggable,
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
    defaultSection: function() {
      if (this.card.items && this.card.items.length) {
        return {
          title: 'No Section',
          items: this.card.items,
          model: this.card.model,
          id: this.card.id
        }
      }
      return null
    }
  },
}
</script>

<style lang="scss">
  .kanban-card {
    background: $body-bg;
    border: 1px solid $base-border-color;
    border-radius: 3px;
    width: 28%;
    min-width: 300px;
    max-width: 600px;
    display: inline-block;
    margin-left: 20px;
    height: auto;
    vertical-align: top;
    overflow: hidden;
    position: relative;

    &:last-child {
      margin-right: 20px;
    }

    .kanban-card-heading {
      background: white;
    }

    .kanban-card-body {
      height: auto;
      min-height: 1px;
      border-top: 1px solid $base-border-color;
      overflow-y: scroll;
      // ul {
      //   padding: 10px 0 0;
      //   margin: 0;
      // }

      &.folder {
        background: $body-bg;
        // padding: 10px;
        ul {
          padding: 10px 0 0;
          margin: 0;
        }
      }

      &.checklist {
        background: white;
        // padding: 0 !important;
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

    .kanban-card-footer {
      border-top: 1px dashed $base-border-color;
      background: $body-bg;
      position: absolute;
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
      &.checklist {
        border: 1px solid $base-border-color;
        border-radius: 3px;
        padding: 10px;
        background: white;
        &:not(:last-of-type) {
          margin-bottom: 10px;
        }
      }
      &.checklist-item {
        padding: 3px 0;
        background: white;
        margin-bottom: 0;
        border-top: 1px solid white;
        border-bottom: 1px solid white;
        &:hover {
          border-top: 1px solid $base-border-color;
          border-bottom: 1px solid $base-border-color;
          background: $body-bg;
        }
      }

      .toggle-nested-kanban-btn {
        color: $base-border-color;
        font-size: 0.8em;
        cursor: pointer;
        padding: 5px;

        &:hover {
          color: darken($base-border-color, 20%);
        }
      }

      .nested-kanban-card-buttons {
        position: absolute;
        right: 5px;

        .folder &,
        .checklist & {
          top: 12px;
        }

        .checklist-item & {
          top: 6px;
        }

        & .fa-chevron-up,
        & .fa-chevron-down {
          margin-right: 5px;
        }
      }
    }

    .folder .fa-folder {
      color: $folder-primary;
    }

    .checklist .fa-list {
      color: $list-primary;
    }
  }
</style>
