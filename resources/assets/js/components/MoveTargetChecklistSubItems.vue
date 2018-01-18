<template lang="html">
  <div class="move-target-checklist-sub-items">
    <div class="info-message" v-if="showInfoMessage">
      <i class="fa fa-spinner fa-spin fa-lg" aria-hidden="true" v-if="moverIsLoading"/>
      <p :class="[checklistSubItemInfoMessage.type]" v-if="checklistSubItemInfoMessage.content&&checklistSubItemInfoMessage.type">{{ checklistSubItemInfoMessage.content }}</p>
    </div>

    <small class="text-muted" v-if="movableChecklistSubItems&&movableChecklistSubItems.length"><i class="fa fa-fw fa-lightbulb-o" aria-hidden="true"/> Click to select, doubleclick to open.</small>

    <ul class="list-unstyled" v-if="movableChecklistSubItems&&movableChecklistSubItems.length&&!moverIsLoading">
      <li class="nested-checklist-item"
          :class="{ active: item.id==selectedMovableChecklistItem.id }"
          v-for="item in movableChecklistSubItems"
          @click.stop.prevent="selectMoverChecklistItem(item)"
          @dblclick.stop.prevent="openMoverChecklistItem(item)"
          :key="item.id"
      >
        <span>
          <i class="fa fa-fw fa-square-o" aria-hidden="true"/>
          {{ item.content }}
        </span>
      </li>
    </ul>
  </div>

</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'move-target-checklist-sub-items',
  computed: {
    ...mapGetters([
      'checklistSubItemInfoMessage',
      'movableChecklistSubItems',
      'moverIsLoading',
      'openMovableChecklistItem',
      'selectedMovableChecklistItem',
    ]),
    showInfoMessage: function() {
      return this.moverIsLoading || this.checklistSubItemInfoMessage.content && this.checklistSubItemInfoMessage.type
    },
    hasChecklistItems: function() {
      return ! _.isEmpty(this.selectedMovableChecklistItem.children)
    },
  },
  methods: {
    ...mapActions([
      'addToMoverArray',
      'fetchChecklistSubItems',
      'openMoverChecklistItem',
      'removeFromMoverArray',
      'deselectMoverSelected',
      'setMoverVariable',
      'selectMoverChecklistItem',
      'toggleMoverVariable',
    ]),
  },
}
</script>

<style lang="scss">
.move-target-checklist-sub-items {
  background: white;
  // padding: 10px;
}
</style>
