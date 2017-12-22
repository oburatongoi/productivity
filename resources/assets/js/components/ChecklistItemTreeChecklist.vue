<template lang="html">
  <li
  class="item"
  @click="emitClick({selection: {model: 'checklist', listing: checklist, parentModel: 'folder'}, event: $event})"
  >
    <i class="fa fa-fw fa-list-ul" aria-hidden="true"/>
    {{ checklist.title }}
  </li>
</template>

<script>
export default {
  name: 'checklist-item-tree-checklist',
  props: {
    checklist: {
      type: Object,
      required: true
    }
  },
  methods: {
    emitClick: function(payload) {
      this.$emit('onClick', payload)
    }
  }
}
</script>
