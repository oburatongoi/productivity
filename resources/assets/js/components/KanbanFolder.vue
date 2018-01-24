<template lang="html">
  <li class="nested-kanban-card folder">
    <i class="fa fa-fw fa-folder" aria-hidden="true"/>
    {{ folder.name | truncate(35) }}
    <span class="nested-kanban-card-buttons">
      <i class="fa fa-fw fa-chevron-right toggle-nested-kanban-btn" aria-hidden="true" @click="toggleNestedKanban(folder)"/>
    </span>
  </li>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  name: 'kanban-folder',
  props: {
    folder: {
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
