<template lang="html">
  <div class="sub-checklist-items">
    <checklist-items
      :list-type="listType"
      :items="items"
      :parent-model="parentModel"
      :parent="parent"
      @onChecklistItemClick="toggleSelection"
    />
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import ChecklistItems from './ChecklistItems.vue'
export default {
  name: 'sub-checklist-items',
  components: {
    ChecklistItems
  },
  props: {
    parent: {
      type: Object,
      required: true
    },
    items: {
      type: Array,
      required: true
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
  computed: {
    ...mapGetters([
      'editableItem'
    ])
  },
  methods: {
    ...mapActions([
      'toggleSelection'
    ])
  },
}
</script>

<style lang="css">
</style>
