<template>
    <draggable class="checklist-items"
      :class="{'list-unstyled': listType!=='ol'}"
      :element="draggableListType"
      @end="beforeUpdateSortOrder"
      :list="items"
    >
        <checklist-item
          v-if="items"
          v-for="item in items"
          :item="item"
          :list-type="listType"
          :key="item.id"
          :parent-model="parentModel"
          @onEmitClick="emitChecklistItemClick"
        ></checklist-item>
    </draggable>
</template>

<script>
import { mapActions } from 'vuex'

import ChecklistItem from './ChecklistItem.vue'
import Draggable from 'vuedraggable'

export default {
    name: 'checklist-items',
    props: {
      items: {
        type: Array,
        default: () => []
      },
      listType: {
        type: String,
        default: 'ch'
      },
      parent: {
        type: Object,
        required: true
      },
      parentModel: {
        type: String,
        required: true
      }
    },
    computed: {
      draggableListType: function() {
        return this.checklist&&this.checklist.list_type&&this.checklist.list_type == 'nu' ? 'ol' : 'ul';
      }
    },
    methods: {
      ...mapActions([
        'sortChecklistItems',
        'updateSortOrder'
      ]),
      beforeUpdateSortOrder: function() {
        return this.updateSortOrder({checklistItems: this.items, parent: this.parent, parentModel: this.parentModel})
      },
      emitChecklistItemClick: function(payload) {
        return this.$emit('onChecklistItemClick', payload)
      }
    },
    components: {
        ChecklistItem,
        Draggable
    },
    created: function() {
      return this.sortChecklistItems()
    }
}
</script>

<style lang="scss">
  .checklist-items {
    padding: 0;
  }
</style>
