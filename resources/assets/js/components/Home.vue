<template lang="html">
  <div class="home">
    <index-tasks></index-tasks>

    <manage-checklist-item
      v-if="currentEditableItemID&&currentEditableItemIndex"
      :current-editable-item="checklistItems[currentEditableItemIndex]"
    ></manage-checklist-item>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import IndexTasks from './IndexTasks.vue'
import ManageChecklistItem from './ManageChecklistItem.vue'

export default {
  name: 'home',
  components: {
      IndexTasks,
      ManageChecklistItem
  },
  ...mapGetters([
    'checklistItems',
    'currentEditableItemID',
    'currentEditableItemIndex'
  ]),
}
</script>

<style lang="css">

</style>
