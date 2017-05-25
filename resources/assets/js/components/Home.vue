<template lang="html">
  <div class="home" :class="homeClass">
    <div class="panel main-panel">
      <div class="home-heading">

      </div>

      <div class="home-body panel-body">
        <home-checklist-items></home-checklist-items>
      </div>
    </div>

    <manage-checklist-item v-if="currentEditableItem.id"></manage-checklist-item>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import HomeChecklistItems from './HomeChecklistItems.vue'
import ManageChecklistItem from './ManageChecklistItem.vue'

export default {
  name: 'home',
  components: {
      HomeChecklistItems,
      ManageChecklistItem
  },
  computed: {
    ...mapGetters([
      'currentEditableItem',
      'currentEditableItemIsExpanded'
    ]),
    homeClass: function() {
      if (this.currentEditableItem.id && this.currentEditableItemIsExpanded) return 'has-expanded-editable-item'
      if (this.currentEditableItem.id && ! this.currentEditableItemIsExpanded) return 'has-editable-item'
      return null
    },
  }
}
</script>

<style lang="css">

</style>
