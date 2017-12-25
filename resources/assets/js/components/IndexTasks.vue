<template>
  <div class="index-tasks" :class="taskClass">
    <div class="panel main-panel">
      <div class="home-body panel-body">
        <ul
          class="list-unstyled checklist-items"
          v-if="checklistItems.length"
        >
            <checklist-item
              v-for="item in checklistItems"
              :item="item"
              type="ta"
              :key="item.id"
              :parent-model="'checklist'"
              @onEmitClick="toggleSelection"
            />

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
    />

    <edit-checklist-item
      v-if="editableItem.id"
      :list-type="'ta'"
      :item="editableItem"
      parent-model="checklist"
    />

    <edit-checklist-item
      v-if="editableSubItem.id"
      :list-type="'ta'"
      :item="editableSubItem"
      parent-model="checklist-item"
    />
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

import ChecklistItem from './ChecklistItem.vue'
import ChecklistItemTree from './ChecklistItemTree.vue'
import EditChecklistItem from './EditChecklistItem.vue'

export default {
  name: 'index-tasks',
  components: {
      ChecklistItem,
      ChecklistItemTree,
      EditChecklistItem
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
      return  this.editableSubItemIsExpanded ? 'has-expanded-editable-sub-item':
              this.editableSubItem.id        ? 'has-editable-sub-item'         :
              this.editableItemIsExpanded    ? 'has-expanded-editable-item'    :
              this.editableItem.id           ? 'has-editable-item'             :
                                                null                           ;
    }
  },
  created: function() {
    this.$eventHub.$on('debounceResizeInput', this.debounceResizeInput);
    this.$eventHub.$on('toggleSelection', this.toggleSelection);
  },
  beforeDestroy: function() {
    this.$eventHub.$off('debounceResizeInput', this.debounceResizeInput);
    this.$eventHub.$off('toggleSelection', this.toggleSelection);
  },
  methods: {
    ...mapActions([
      'toggleSelection'
    ])
  },
}
</script>

<style lang="scss">
</style>
