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

</style>
