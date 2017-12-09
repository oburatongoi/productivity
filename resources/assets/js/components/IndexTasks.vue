<template>
  <div class="index-tasks" :class="taskClass">
    <div class="panel main-panel">
      <div class="home-body panel-body">
        <ul class="list-unstyled checklist-items">
            <checklist-item
              v-if="checklistItems.length"
              v-for="item in checklistItems"
              :item="item"
              type="ta"
              :key="item.id"
            ></checklist-item>

            <li v-if="!checklistItems.length">There are no pending tasks at this time.</li>
        </ul>
      </div>
    </div>

    <manage-checklist-item
      v-if="currentEditableItemID"
      :current-editable-item="checklistItems[currentEditableItemIndex]"
    ></manage-checklist-item>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

import ChecklistItem from './ChecklistItem.vue'
import ManageChecklistItem from './ManageChecklistItem.vue'

export default {
    name: 'index-tasks',
    computed: {
      ...mapGetters([
        'checklistItems',
        'currentEditableItemID',
        'currentEditableItemIndex',
        'currentEditableItemIsExpanded'
      ]),
      taskClass: function() {
        if (this.currentEditableItemID && this.currentEditableItemIsExpanded) return 'has-expanded-editable-item'
        if (this.currentEditableItemID && ! this.currentEditableItemIsExpanded) return 'has-editable-item'
        return null
      },
    },
    components: {
        ChecklistItem,
        ManageChecklistItem
    },
}
</script>
