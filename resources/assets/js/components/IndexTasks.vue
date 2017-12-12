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
              :parent-model="'checklist'"
              @onEmitClick="toggleSelection"
            ></checklist-item>

            <li v-if="!checklistItems.length">There are no pending tasks at this time.</li>
        </ul>
      </div>
    </div>

    <manage-checklist-item
      v-if="currentEditableItem.id"
      :currently-editable-item="checklistItems[currentEditableItem.index]"
    ></manage-checklist-item>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

import ChecklistItem from './ChecklistItem.vue'
import ManageChecklistItem from './ManageChecklistItem.vue'

export default {
    name: 'index-tasks',
    methods: {
      ...mapActions([
        'toggleSelection'
      ])
    },
    computed: {
      ...mapGetters([
        'checklistItems',
        'currentEditableItem'
      ]),
      taskClass: function() {
        if (this.currentEditableItem.id && this.currentEditableItem.isExpanded) return 'has-expanded-editable-item'
        if (this.currentEditableItem.id && ! this.currentEditableItem.isExpanded) return 'has-editable-item'
        return null
      }
    },
    components: {
        ChecklistItem,
        ManageChecklistItem
    },
}
</script>
