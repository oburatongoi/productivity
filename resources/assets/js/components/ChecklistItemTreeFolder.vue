<template lang="html">
  <li
  class="item"
  @click="emitClick({selection: {model: 'folder', listing: folder, parentModel: 'folder'}, event: $event})"
  >
    <i class="fa fa-fw fa-folder-open-o" aria-hidden="true"/>
    {{ folder.name }}
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
    emitClick: function(payload) {
      this.$emit('onClick', payload)
    }
  }
}
</script>
