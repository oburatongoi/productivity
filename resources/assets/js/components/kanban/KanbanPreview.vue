<template lang="html">
  <div
  class="kanban-preview"
  :class="{'is-expanded': listing.isExpanded}"
  id="kanban-preview">

    <edit-checklist-item
    v-if="listing.model=='checklist-item'&&!editableSubItem.id"
    :list-type="listing.sub_list_type"
    :item="listing"
    parent-context="kanban" />

    <edit-checklist-item
    v-if="editableSubItem.id"
    :list-type="editableSubItem.list_type"
    :item="editableSubItem"
    parent-context="kanban" />

  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import EditChecklistItem from '../EditChecklistItem.vue'
export default {
  name: 'kanban-preview',
  components: {
    EditChecklistItem,
  },
  props: {
    listing: {
      type: Object,
      required: true
    }
  },
  computed: {
    ...mapGetters([
      'editableSubItem'
    ]),
  },
}
</script>

<style lang="scss">
.kanban-preview {
  position: absolute;
  top: 0;
  // bottom: 0;
  right: 0;
  height: 100%;
  width: 50%;
  min-width: 600px;
  background: white;
  padding-bottom: 40px;
  border-left: 1px solid $base-border-color;
  -webkit-box-shadow: -5px 0 5px -5px darken($base-border-color, 10%);
          box-shadow: -5px 0 5px -5px darken($base-border-color, 10%);

  &.is-expanded {
    width: 100%;
  }
}
</style>
