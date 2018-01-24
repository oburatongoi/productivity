<template lang="html">
  <div class="move-target-open-checklist-item">
    <span
      class="mover-close-checklist-button"
      @click="closeMoverChecklistItem"
    >
      <i class="fa fa-fw fa-arrow-left"/>
      <span>Back</span>
    </span>

    <!-- <mover-breadcrumbs /> -->

    <div
      class="nested-checklist-item opened"
      :class="{ active: openMovableChecklistItem.id==selectedMovableChecklistItem.id }"
      @click.stop.prevent="selectMoverChecklistItem(openMovableChecklistItem)"
    >
      <span class="content">
        <i class="fa fa-fw fa-circle-thin" aria-hidden="true"/>
        {{ openMovableChecklistItem.content }}
      </span>

      <move-target-checklist-sub-items />
    </div>
  </div>

</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import MoverAdder from './MoverAdder.vue'
import MoverBreadcrumbs from './MoverBreadcrumbs.vue'
import MoveTargetChecklistSubItems from './MoveTargetChecklistSubItems.vue'
export default {
  name: 'move-target-open-checklist-item',
  components: {
    MoverAdder,
    MoverBreadcrumbs,
    MoveTargetChecklistSubItems,
  },
  computed: {
    ...mapGetters([
      'checklistSubItemInfoMessage',
      'movableChecklistSubItems',
      'moverIsLoading',
      'openMovableChecklistItem',
      'precedingMovableChecklistItem',
      'selectedMovableChecklistItem',
    ]),
    showInfoMessage: function() {
      return this.moverIsLoading || this.checklistSubItemInfoMessage.content && this.checklistSubItemInfoMessage.type
    },
    hasChecklistItems: function() {
      return ! _.isEmpty(this.selectedMovableChecklistItem.sub_items)
    },
  },
  methods: {
    ...mapActions([
      'addToMoverArray',
      'fetchChecklistSubItems',
      'refreshChecklistSubItems',
      'removeFromMoverArray',
      'deselectMoverSelected',
      'selectMoverChecklistItem',
      'setMoverVariable',
      'toggleMoverVariable',
    ]),
  },
}
</script>

<style lang="scss">
.move-target-open-checklist-item {
  background: white;
  padding: 0;

  .nested-checklist-item {
      .fa {
          color: $list-primary;
      }
      &.active {
          border: 1px dotted $list-primary;
          span.content {
            color: $list-primary;
          }
      }
  }
}
</style>
