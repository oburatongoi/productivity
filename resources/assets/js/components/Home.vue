<template lang="html">
  <div class="home">
    <index-tasks/>

    <edit-checklist-item
      v-if="currentEditableItem.id&&currentEditableItem.index"
      :current-editable-item="checklistItems[currentEditableItem.index]"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import IndexTasks from './IndexTasks.vue'
import EditChecklistItem from './EditChecklistItem.vue'

export default {
  name: 'home',
  components: {
      IndexTasks,
      EditChecklistItem
  },
  ...mapGetters([
    'checklistItems',
    'currentEditableItem',
  ]),
}
</script>

<style lang="css">

</style>
