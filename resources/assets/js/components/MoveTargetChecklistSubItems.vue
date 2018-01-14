<template lang="html">
  <div class="move-target-checklist-sub-items">
    <div class="info-message" v-if="showInfoMessage">
      <i class="fa fa-spinner fa-spin fa-lg" aria-hidden="true" v-if="moverIsLoading"/>
      <p :class="[checklistSubItemInfoMessage.type]" v-if="checklistSubItemInfoMessage.content&&checklistSubItemInfoMessage.type">{{ checklistSubItemInfoMessage.content }}</p>
    </div>

    <ul class="list-unstyled" v-if="movableChecklistSubItems&&!moverIsLoading">
      <li class="nested-checklist-item"
          :class="{ active: item.id==selectedMovableChecklistItem.id }"
          v-for="item in movableChecklistSubItems"
          @click.stop.prevent="selectMoverChecklistItem(item)"
          @dblclick.stop.prevent="openChecklistItem(item)"
          :key="item.id"
      >
        <span>
          <i class="fa fa-fw fa-circle-thin" aria-hidden="true"/>
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
      'openChecklistItem',
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
  padding: 10px;
}
</style>
