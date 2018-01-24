<template lang="html">
  <div class="kanban-wrapper" id="kanban-wrapper">
    <draggable
      id="kanban"
      class="kanban"
      :element="'ul'"
      :options="{ draggable: '.kanban-card' }"
    >
      <li
        class="kanban-card"
        :class="card.model"
        v-for="card in kanbanCards"
        :key="card.model+card.id"
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
          <kanban-folder v-for="folder in card.subfolders" :key="folder.id" :folder="folder"/>
          <kanban-checklist v-for="checklist in card.checklists" :key="checklist.id" :checklist="checklist"/>

          <template v-if="card.model=='checklist'">
            <kanban-section v-for="section in card.sections" :key="section.id" :section="section"/>
            <kanban-checklist-item v-for="item in card.items" :key="item.id" :item="item"/>
            <add-item-lite :parent="card"/>
          </template>
        </draggable>

        <div class="kanban-card-footer">
          <kanban-adder :parent="card"/>
        </div>
      </li>
    </draggable>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import AddItemLite from './AddItemLite.vue'
import Draggable from 'vuedraggable'
import KanbanAdder from './KanbanAdder.vue'
import KanbanChecklist from './KanbanChecklist.vue'
import KanbanChecklistItem from './KanbanChecklistItem.vue'
import KanbanFolder from './KanbanFolder.vue'
import KanbanSection from './KanbanSection.vue'
export default {
  name: 'kanban',
  components: {
      AddItemLite,
      Draggable,
      KanbanAdder,
      KanbanChecklist,
      KanbanChecklistItem,
      KanbanFolder,
      KanbanSection
  },
  computed: {
    ...mapGetters([
      'kanbanCards',
    ]),
  },
  created: function() {
    this.$eventHub.$on('resizeKanban', this.resizeKanban);
  },
  beforeDestroy: function() {
    this.$eventHub.$off('resizeKanban', this.resizeKanban);
  },
  mounted: function() {
    this.$nextTick( function () {
      this.resizeKanban()
    })
  },
  methods: {
    resizeKanban: function() {
      var kanban = document.getElementById('kanban'),
          // kanbanWrapper = document.getElementById('kanban-wrapper'),
          // innerContentBody = document.getElementById('inner-content-body'),
          // innerContentBodyHeight = $(innerContentBody).outerHeight(true),
          // kanbanWrapperHeight = $(kanbanWrapper).outerHeight(true),
          kanbanHeight = $(kanban).outerHeight(true),
          kanbans = kanban.getElementsByClassName('kanban-card');

          for (var i = 0; i < kanbans.length; i++) {
            var body = kanbans[i].querySelector('.kanban-card-body'),
                heading = kanbans[i].querySelector('.kanban-card-heading'),
                footer = kanbans[i].querySelector('.kanban-card-footer'),
                headingHeight = $(heading).outerHeight(true),
                footerHeight = $(footer).outerHeight(true),
                computedBodyHeight = kanbanHeight + 20 - headingHeight - footerHeight
            body.style.maxHeight = computedBodyHeight + 'px'
            body.style.paddingBottom = (footerHeight + 10) + 'px'
            // console.log('resizing to '+ (kanbanHeight - headingHeight - footerHeight - 50) + 'px');

            // console.log('innerContentBodyHeight: '+innerContentBodyHeight);
            // console.log('kanbanWrapperHeight: '+kanbanWrapperHeight);
            // console.log('kanbanHeight: '+kanbanHeight);
            // console.log('headingHeight: '+headingHeight);
            // console.log('footerHeight: '+footerHeight);
            // console.log('computedBodyHeight: '+computedBodyHeight);

          }
    },
  }
}
</script>

<style lang="scss">
.kanban-wrapper {
  border-top: 1px solid $base-border-color;
  width: 100%;
  height: 100%;
  background: white;
  // padding: 20px 0 0 20px;
  padding: 20px 0 0 0;
  overflow: hidden;
}
.kanban {
  overflow-y: hidden;
  overflow-x: scroll;
  height: 100%;
  width: auto;
  min-width: 100%;
  background: white;
  white-space: nowrap;
  list-style: none;
  padding: 0;
  margin: 0;

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
}


</style>
