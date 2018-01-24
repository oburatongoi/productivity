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
    </draggable>

    <add-item-lite :parent="section"/>
    <add-section />
  </li>
</template>

<script>
import { mapActions } from 'vuex'
import AddItemLite from './AddItemLite.vue'
import AddSection from './AddSection.vue'
import Draggable from 'vuedraggable'
import KanbanChecklistItem from './KanbanChecklistItem.vue'
export default {
  name: 'kanban-section',
  components: {
    AddItemLite,
    AddSection,
    Draggable,
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
     text-decoration: underline;
     color: $light-grey-text-color;
   }

   .section-items {
     min-height: 5px;
   }
   padding-bottom: 5px;
 }
</style>
