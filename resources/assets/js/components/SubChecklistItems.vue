<template lang="html">
  <div class="sub-checklist-items">
    <add-item
      :parent="parent"
      :parent-model="parentModel"
    ></add-item>

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
import { mapGetters } from 'vuex'
import AddItem from './AddItem.vue'
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
    toggleSelection: function(payload) {
      console.log(payload);
    }
  },
  computed: {
    ...mapGetters([
      'editableChecklistItem'
    ])
  },
  components: {
    AddItem,
    ChecklistItems
  },
}
</script>

<style lang="css">
</style>
