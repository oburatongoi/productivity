<template lang="html">
  <div class="sub-checklist-items">
    <add-item
      :parent="currentEditableItem"
      parent-model="checklistItem"
    ></add-item>

    <checklist-items
      :list-type="currentEditableItem.sub_list_type"
      :items="currentEditableItem.child_list_items"
      parent-model="checklist-item"
      :parent="currentEditableItem"
      @onChecklistItemClick="toggleSelection"
    ></checklist-items>
  </div>
</template>

<script>
import AddItem from './AddItem.vue'
import ChecklistItems from './ChecklistItems.vue'
export default {
  name: 'sub-checklist-items',
  props: {
    currentEditableItem: {
      type: Object,
      required: true
    }
  },
  methods: {
    toggleSelection: function(payload) {
      console.log(payload);
    }
  },
  components: {
    AddItem,
    ChecklistItems
  },
}
</script>

<style lang="css">
</style>
