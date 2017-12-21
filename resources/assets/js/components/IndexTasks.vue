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

    <checklist-item-tree
      v-if="editableSubItem.id"
      :item="editableItem"
      :checklist="editableItem.checklist"
      :folder="editableItem.checklist.folder"
      parent-component="index-tasks"
      @onSelection="toggleSelection"
    ></checklist-item-tree>

    <edit-checklist-item
      v-if="editableItem.id"
      :list-type="'ta'"
      :item="editableItem"
      parent-model="checklist"
    ></edit-checklist-item>

    <edit-checklist-item
      v-if="editableSubItem.id"
      :list-type="'ta'"
      :item="editableSubItem"
      parent-model="checklist-item"
    ></edit-checklist-item>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

import ChecklistItem from './ChecklistItem.vue'
import ChecklistItemTree from './ChecklistItemTree.vue'
import EditChecklistItem from './EditChecklistItem.vue'

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
        'editableItem',
        'editableSubItem',
        'editableItemIsExpanded',
        'editableSubItemIsExpanded'
      ]),
      taskClass: function() {
        // if (this.editableItem.id && this.editableItemIsExpanded) return 'has-expanded-editable-item'
        // if (this.editableItem.id && ! this.editableItemIsExpanded) return 'has-editable-item'
        // return null
        return  this.editableSubItemIsExpanded ? 'has-expanded-editable-sub-item':
                this.editableSubItem.id        ? 'has-editable-sub-item'         :
                this.editableItemIsExpanded    ? 'has-expanded-editable-item'    :
                this.editableItem.id           ? 'has-editable-item'             :
                                                  null                           ;
      }
    },
    components: {
        ChecklistItem,
        ChecklistItemTree,
        EditChecklistItem
    },
}
</script>

<style lang="scss">
</style>
