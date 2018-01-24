<template lang="html">
  <li class="nested-kanban-card section">
    <span class="section-title">
      {{ section.title | truncate(35) }}
    </span>

    <draggable
      class="section-items"
      :element="'ul'"
      :options="{ draggable: '.checklist-item', group: { name: 'checklist-item', pull: true, put: true } }"
    >
      <kanban-checklist-item v-for="item in section.items" :key="item.id" :item="item" />
      <!-- <small class="text-muted" v-if="!section.items||!section.items.length">This section is empty</small> -->
    </draggable>
    <kanban-adder :parent="section" size="small"/>
  </li>
</template>

<script>
import { mapActions } from 'vuex'
import Draggable from 'vuedraggable'
import KanbanAdder from './KanbanAdder.vue'
import KanbanChecklistItem from './KanbanChecklistItem.vue'
export default {
  name: 'kanban-section',
  components: {
    Draggable,
    KanbanAdder,
    KanbanChecklistItem
  },
  props: {
    section: {
      type: Object,
      required: true
    }
  },
  methods: {
    ...mapActions([
      'toggleNestedKanban',
    ]),
  }
}
</script>

<style lang="scss">
 .nested-kanban-card.section {
   .section-title {
    //  text-decoration: underline;
     font-weight: 600;
     color: $light-grey-text-color;
   }

   .section-items {
     min-height: 5px;
   }
   border-bottom: 1px solid $base-border-color;
   padding-bottom: 10px;
   margin-bottom: 10px;
 }
</style>
