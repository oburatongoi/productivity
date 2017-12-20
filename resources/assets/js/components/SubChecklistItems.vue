<template lang="html">
  <div class="sub-checklist-items">
    <checklist-items
      :list-type="listType"
      :items="items"
      :parent-model="parentModel"
      :parent="parent"
      @onChecklistItemClick="toggleSelection"
    ></checklist-items>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import ChecklistItems from './ChecklistItems.vue'
export default {
  name: 'sub-checklist-items',
  props: {
    parent: {
      type: Object
    },
    items: {
      type: Array
    },
    listType: {
      type: String,
      default: 'ch'
    },
    parentModel: {
      type: String,
      default: 'checklist-item'
    }
  },
  methods: {
    ...mapActions([
      'toggleSelection'
    ])
  },
  computed: {
    ...mapGetters([
      'editableItem'
    ])
  },
  components: {
    ChecklistItems
  },
}
</script>

<style lang="css">
</style>
