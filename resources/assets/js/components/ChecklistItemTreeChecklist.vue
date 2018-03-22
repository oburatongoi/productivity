<template lang="html">
  <li
  class="item"
  @click="selectTreeLeaf({selection: {model: 'checklist', listing: checklist, parentModel: 'folder'}, event: $event})"
  >
    <i class="far fa-fw fa-list-ul" aria-hidden="true"/>
    {{ checklist.title | truncate(35) }}
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
    selectTreeLeaf: function(payload) {
      return this.$eventHub.$emit('selectTreeLeaf', payload);
    }
  }
}
</script>
