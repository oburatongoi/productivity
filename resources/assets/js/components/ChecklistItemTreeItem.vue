<template lang="html">
  <ul class="nested-tree" v-if="isAncestorOfEditableSubItem">
    <li class="item"
      @click="selectTreeLeaf({selection: {model: 'checklist-item', listing: item, parentModel: 'checklist'}, event: $event})"
    >
      <i class="far fa-fw fa-check" aria-hidden="true" v-if="item.checked_at"/>
      <i class="fal fa-fw fa-circle" aria-hidden="true" v-if="!item.checked_at"/>
      {{ item.content | truncate(35) }}
    </li>

    <li v-if="subItemChain.length">
      <checklist-item-tree-sub-item
        :item="subItemChain[subItemChain.length-1]"
        :depth="2"
      />
    </li>
  </ul>
</template>

<script>
import ChecklistItemTreeSubItem from './ChecklistItemTreeSubItem.vue'
import { mapGetters } from 'vuex'
export default {
  name: 'checklist-item-tree-item',
  components: {
    ChecklistItemTreeSubItem
  },
  props: {
    item: {
      type: Object,
      required: true
    }
  },
  computed: {
    ...mapGetters([
      'editableSubItem',
      'selected',
      'subItemChain',
    ]),
    isAncestorOfEditableSubItem: function() {
      let arr = _.intersectionBy(this.subItemChain, this.item.sub_items, 'id')
      return _.some(arr, ['parent_id', this.item.id])
    }
  },
  methods: {
    selectTreeLeaf: function(payload) {
      return this.$eventHub.$emit('selectTreeLeaf', payload);
    }
  },
}
</script>
