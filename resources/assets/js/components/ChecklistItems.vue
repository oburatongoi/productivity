<template>
    <draggable class="checklist-items"
      :class="{'list-unstyled': listType!=='ol'}"
      :element="listType"
      @end="updateSortOrder"
      :list="checklistItems"
    >
        <checklist-item
          v-if="checklistItems"
          v-for="item in checklistItems"
          :item="item"
          :list-type="checklist.list_type"
          :key="item.id"
        ></checklist-item>
    </draggable>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

import ChecklistItem from './ChecklistItem.vue'
import Draggable from 'vuedraggable'

export default {
    name: 'checklist-items',
    computed: {
      ...mapGetters([
        'checklist',
        'checklistItems'
      ]),
      listType: function() {
        return this.checklist&&this.checklist.list_type&&this.checklist.list_type == 'nu' ? 'ol' : 'ul';
      }
    },
    methods: {
      ...mapActions([
        'sortChecklistItems',
        'updateSortOrder'
      ])
    },
    components: {
        ChecklistItem,
        Draggable
    },
    created: function() {
      return this.sortChecklistItems()
    }
}
</script>

<style lang="scss">
  .checklist-items {
    padding: 0;
  }
</style>
