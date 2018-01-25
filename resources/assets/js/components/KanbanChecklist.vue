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
      <template v-if="checklist.sections&&checklist.sections.length">
        <kanban-section v-for="section in checklist.sections" :key="section.id" :section="section" :parent="checklist"/>
        <kanban-section :section="defaultSection" :parent="checklist" v-if="defaultSection"/>
      </template>

      <template v-if="checklist.items&&!checklist.sections">
        <kanban-checklist-item v-for="item in checklist.items" :key="'item'+item.id" :item="item"/>
        <add-item-lite :parent="checklist"/>
        <add-section :parent="checklist"/>
      </template>

      <template v-if="!checklist.items&&!checklist.sections">
        <add-item-lite :parent="checklist"/>
        <add-section :parent="checklist"/>
      </template>
    </draggable>
<!--
    <template v-if="!!checklist.opened">
      <add-section :parent="checklist"/>
    </template> -->
  </li>
</template>

<script>
import { mapActions } from 'vuex'
import AddItemLite from './AddItemLite.vue'
import AddSection from './AddSection.vue'
import Draggable from 'vuedraggable'
import KanbanChecklistItem from './KanbanChecklistItem.vue'
import KanbanSection from './KanbanSection.vue'
export default {
  name: 'kanban-checklist',
  components: {
    AddItemLite,
    AddSection,
    Draggable,
    KanbanChecklistItem,
    KanbanSection
  },
  props: {
    checklist: {
      type: Object,
      required: true
    }
  },
  computed: {
    defaultSection: function() {
      if (this.checklist.items && this.checklist.items.length) {
        return {
          title: 'No Section',
          items: this.checklist.items,
          model: this.checklist.model,
          id: this.checklist.id
        }
      }
      return null
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
