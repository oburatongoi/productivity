<template lang="html">
  <ul class="nested-tree">
    <li
    class="item"
    @click="emitClick({selection: {model: 'checklist-item', listing: item, parentModel: 'checklist'}, event: $event})"
    >
      <i class="fa fa-fw fa-check" aria-hidden="true" v-if="item.checked_at"></i>
      <i class="fa fa-fw fa-circle-thin" aria-hidden="true" v-if="!item.checked_at"></i>
      {{item.content}}
    </li>
    <li>
      <ul class="nested-tree">
        <li
        v-for="subItem in item.child_list_items"
        class="item"
        :class="{selected: subItem.id==editableSubItem.id}"
        @click="emitClick({selection: {model: 'checklist-item', listing: subItem, parentModel: 'checklist-item'}, event: $event})"
        :key="subItem.id"
        >
          <i class="fa fa-fw fa-check" aria-hidden="true" v-if="subItem.checked_at"></i>
          <i class="fa fa-fw fa-square-o" aria-hidden="true" v-if="!subItem.checked_at"></i>
          {{subItem.content}}
        </li>
      </ul>
    </li>
  </ul>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'checklist-item-tree-item',
  props: {
    item: {
      type: Object,
      required: true
    }
  },
  methods: {
    emitClick: function(payload) {
      this.$emit('onClick', payload)
    }
  },
  computed: {
    ...mapGetters([
      'editableSubItem'
    ])
  },
}
</script>
