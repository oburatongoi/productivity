<template lang="html">
  <li class="nested-kanban-card checklist-item">
    <i class="fa fa-fw fa-circle-thin" aria-hidden="true"/>
    {{ item.content | truncate(35) }}
    <span class="nested-kanban-card-buttons">
      <i class="fa fa-fw fa-chevron-right toggle-nested-kanban-btn" aria-hidden="true" @click="toggleNestedKanban(item)"/>
    </span>
  </li>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'kanban-checklist-item',
  props: {
    item: {
      type: Object,
      required: true
    }
  },
  methods: {
    ...mapActions([
      'toggleNestedKanban',
    ]),
  }
}
</script>

<style lang="scss">
.nested-kanban-card {
  &.checklist-item {
    padding: 5px 0;
    background: white;
    margin-bottom: 0;
    border-top: 1px solid white;
    border-bottom: 1px solid white;
    &:hover {
      border-top: 1px solid $base-border-color;
      border-bottom: 1px solid $base-border-color;
      background: $body-bg;
    }
  }
}


</style>
