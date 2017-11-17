<template>
  <div class="index-tasks" :class="taskClass">
    <div class="panel main-panel">
      <div class="home-body panel-body">
        <ul class="list-unstyled checklist-items">
            <checklist-item
              v-if="items.length"
              v-for="item in items"
              :item="item"
              type="ta"
              :key="item.id"
            ></checklist-item>

            <li v-if="!items.length">There are no pending tasks at this time.</li>
        </ul>
      </div>
    </div>

    <manage-checklist-item v-if="currentEditableItem.id"></manage-checklist-item>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

import ChecklistItem from './ChecklistItem.vue'
import ManageChecklistItem from './ManageChecklistItem.vue'

export default {
    name: 'index-tasks',
    computed: {
      ...mapGetters({
        items: 'pendingTasks',
        currentEditableItem: 'currentEditableItem',
        currentEditableItemIsExpanded: 'currentEditableItemIsExpanded'
      }),
      taskClass: function() {
        if (this.currentEditableItem.id && this.currentEditableItemIsExpanded) return 'has-expanded-editable-item'
        if (this.currentEditableItem.id && ! this.currentEditableItemIsExpanded) return 'has-editable-item'
        return null
      },
    },
    components: {
        ChecklistItem,
        ManageChecklistItem
    },
}
</script>
