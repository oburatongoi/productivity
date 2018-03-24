<template lang="html">
  <ul
  class="nested-tree"
  :class="{active: item.id==editableSubItem.id, selected: selected.checklistItems.indexOf(item)!== -1 }" >

    <li
    class="item"
    @click="selectTreeLeaf({selection: { model: 'checklist-item', listing: item, parentModel: 'checklist-item' }, removePrecedingSubItems: true, event: $event})" >
      <i class="far fa-fw fa-check" aria-hidden="true" v-if="item.checked_at"/>
      <i class="far fa-fw fa-square" aria-hidden="true" v-if="!item.checked_at"/>
      {{ item.content | truncate(45) }}
    </li>

    <li v-if="subItemChain[subItemChainIndex]">
      <checklist-item-tree-sub-item
        :item="subItemChain[subItemChainIndex]"
        :depth="depth+1"
      />
    </li>
  </ul>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'checklist-item-tree-sub-item',
  props: {
    item: {
      type: Object,
      required: true
    },
    depth: {
      type: Number,
      required: true
    }
  },
  computed: {
    ...mapGetters([
      'editableSubItem',
      'selected',
      'subItemChain',
    ]),
    subItemChainIndex: function() {
      return this.subItemChain.length-this.depth
    }
  },
  methods: {
    selectTreeLeaf: function(payload) {
      return this.$eventHub.$emit('selectTreeLeaf', payload);
    }
  },
}
</script>
