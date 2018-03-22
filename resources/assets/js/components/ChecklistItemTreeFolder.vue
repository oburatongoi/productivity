<template lang="html">
  <li
  class="item"
  @click="selectTreeLeaf({selection: {model: 'folder', listing: folder, parentModel: 'folder'}, event: $event})"
  >
    <i class="fas fa-fw fa-folder-open" aria-hidden="true"/>
    {{ folder.name | truncate(35) }}
  </li>
</template>

<script>
export default {
  name: 'checklist-item-tree-folder',
  props: {
    folder: {
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
