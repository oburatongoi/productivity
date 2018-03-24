<template lang="html">
  <li class="nested-kanban-card section enlistable">

    <span class="section-title">

      {{ section.title | truncate(truncateLength) }}

    </span>

    <ul class="section-items">

      <i
      class="fal fa-fw fa-circle-notch fa-spin loading-icon"
      aria-hidden="true"
      v-if="section.isLoading" />

      <p
      class="info-message"
      v-if="section.infoMessage">{{ section.infoMessage }}</p>

      <kanban-checklist-item
      v-for="item in section.items"
      :key="item.id"
      :item="item"
      :truncate-length="truncateLength"
      :list-type="section.list_type||parent.list_type"/>

    </ul>

    <add-item-lite :parent="section"/>

    <add-section :parent="parent"/>

  </li>

</template>

<script>
import { mapActions } from 'vuex'
import AddItemLite from '../AddItemLite.vue'
import AddSection from '../AddSection.vue'
import KanbanChecklistItem from './KanbanChecklistItem.vue'
export default {
  name: 'kanban-section',
  components: {
    AddItemLite,
    AddSection,
    KanbanChecklistItem
  },
  props: {
    truncateLength: {
      type: Number,
      default: 45
    },
    parent: {
      type: Object,
      required: true
    },
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
 .nested-kanban-card {
   .section-title {
    //  text-decoration: underline;
    //  color: $light-grey-text-color;
     color: $list-primary;
    font-weight: 300;
    font-size: 1.1em;
   }

   .section-items {
     min-height: 5px;
   }
   padding-bottom: 5px;
 }
</style>
