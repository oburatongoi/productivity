<template lang="html">
  <div class="move-target-checklist-items">
    <div class="info-message" v-if="showInfoMessage">
      <i class="far fa-spinner fa-spin fa-lg" aria-hidden="true" v-if="moverIsLoading"/>
      <p :class="[checklistItemInfoMessage.type]" v-if="checklistItemInfoMessage.content&&checklistItemInfoMessage.type">{{ checklistItemInfoMessage.content }}</p>
    </div>

    <small class="text-muted" v-if="movableChecklistItems&&movableChecklistItems.length"><i class="far fa-fw fa-lightbulb" aria-hidden="true"/> Click to select, doubleclick to open.</small>

    <ul class="list-unstyled" v-if="movableChecklistItems&&movableChecklistItems.length&&!moverIsLoading">
      <li class="nested-checklist-item"
          :class="{ active: item.id==selectedMovableChecklistItem.id }"
          v-for="item in movableChecklistItems"
          @click.stop.prevent="selectMoverChecklistItem(item)"
          @dblclick.stop.prevent="openMoverChecklistItem(item)"
          :key="item.id"
      >
        <span>
          <i class="fal fa-fw fa-circle" aria-hidden="true"/>
          {{ item.content }}
        </span>
      </li>
    </ul>
  </div>

</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import MoverAdder from './MoverAdder.vue'
export default {
  name: 'move-target-checklist-items',
  components: {
    MoverAdder,
  },
  computed: {
    ...mapGetters([
      'checklistItemInfoMessage',
      'movableChecklistItems',
      'moverIsLoading',
      'openMovableChecklistItem',
      'selectedMovableChecklistItem',
    ]),
    showInfoMessage: function() {
      return this.moverIsLoading || this.checklistItemInfoMessage.content && this.checklistItemInfoMessage.type
    },
    hasChecklistItems: function() {
      return ! _.isEmpty(this.selectedMovableChecklistItem.sub_items)
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
.move-target-checklist-items {
  background: white;
  // padding: 10px;
  padding: 0;
}
</style>
