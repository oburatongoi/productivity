<template lang="html">
  <li class="nested-kanban-card checklist">
    <i class="fa fa-fw fa-list" aria-hidden="true"/>
    {{ checklist.title | truncate(35) }}
    <span class="nested-kanban-card-buttons">
      <i class="fa fa-fw fa-chevron-down toggle-nested-kanban-btn" aria-hidden="true" @click="toggleNestedKanban(checklist)" v-if="!checklist.opened"/>
      <i class="fa fa-fw fa-chevron-up toggle-nested-kanban-btn" aria-hidden="true" @click="toggleNestedKanban(checklist)" v-if="!!checklist.opened"/>
    </span>

    <draggable
      v-if="!!checklist.opened"
      :element="'ul'"
      :options="{ draggable: '.checklist-item', group: { name: 'checklist-item', pull: true, put: true } }"
    >
      <template v-if="checklist.descendants&&checklist.descendants.sections.length||checklist.descendants.items.length">
        <kanban-section v-for="section in checklist.descendants.sections" :key="section.id" :section="section"/>
        <kanban-checklist-item v-for="item in checklist.descendants.items" :key="'item'+item.id" :item="item"/>
      </template>
      <!-- <small class="text-muted" v-if="!checklist.descendants||!checklist.descendants.sections.length&&!checklist.descendants.items.length">This list is empty</small> -->
    </draggable>
    <kanban-adder :parent="checklist" size="small" v-if="!!checklist.opened"/>
  </li>
</template>

<script>
import { mapActions } from 'vuex'
import Draggable from 'vuedraggable'
import KanbanAdder from './KanbanAdder.vue'
import KanbanChecklistItem from './KanbanChecklistItem.vue'
import KanbanSection from './KanbanSection.vue'
export default {
  name: 'kanban-checklist',
  components: {
    Draggable,
    KanbanAdder,
    KanbanChecklistItem,
    KanbanSection
  },
  props: {
    checklist: {
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

</style>
