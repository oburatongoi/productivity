<template lang="html">
  <div class="move-target-checklists">
    <template v-if="!openMovableChecklist.id&&moverContext!='checklist-item'">
      <h5>Lists</h5>
      <small class="text-muted" v-if="movableChecklists&&movableChecklists.length"><i class="fa fa-fw fa-lightbulb-o" aria-hidden="true"/> Click to select, doubleclick to open.</small>

      <mover-adder model="checklist"/>

      <div class="info-message" v-if="showChecklistInfoMessage">
        <i class="fa fa-spinner fa-spin fa-lg" aria-hidden="true" v-if="moverIsLoading"/>
        <p :class="[checklistInfoMessage.type]" v-if="checklistInfoMessage.content&&checklistInfoMessage.type">{{ checklistInfoMessage.content }}</p>
      </div>
    </template>

    <ul class="list-unstyled" v-if="movableChecklists&&movableChecklists.length&&!moverIsLoading">
      <li v-if="isStoringMovableChecklist">
        <i class="fa fa-spinner fa-spin fa-lg" aria-hidden="true"/>
      </li>
      <li class="nested-checklist"
          :class="{ active: checklist.id==selectedMovableChecklist.id, opened: checklist.id==openMovableChecklist.id }"
          v-for="checklist in movableChecklists"
          v-if="!openMovableChecklist.id||checklist.id==openMovableChecklist.id"
          :key="checklist.id"
      >
        <span
          @click.stop.prevent="selectMoverChecklist(checklist)"
          @dblclick.stop.prevent="toggleChecklist(checklist)"
        >
          <i class="fa fa-fw fa-list" aria-hidden="true"/>
          {{ checklist.title }}
        </span>
        <i class="fa fa-angle-right" aria-hidden="true" @click="fetchChecklistItems(checklist)"/>
      </li>
    </ul>
  </div>

</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import MoverAdder from './MoverAdder.vue'
export default {
  name: 'move-target-checklists',
  components: {
    MoverAdder,
  },
  props: {
    selectedChecklistItem: {
      type: Object,
      default: () => {}
    },
  },
  computed: {
    ...mapGetters([
      'checklistInfoMessage',
      'movableChecklists',
      'movableChecklistItems',
      'moverContext',
      'moverIsLoading',
      'openMovableChecklist',
      'selectedMovableChecklist',
      'isStoringMovableChecklist'
    ]),

    showChecklistInfoMessage: function() {
      return this.moverIsLoading || this.checklistInfoMessage.content && this.checklistInfoMessage.type
    },

    hasChecklistItems: function() {
      return ! _.isEmpty(this.movableChecklistItems)
    },
  },
  methods: {
    ...mapActions([
      'closeMoverChecklist',
      'fetchChecklistItems',
      'openMoverChecklist',
      'selectMoverChecklist',
      'setMoverVariable',
    ]),

    toggleChecklist: function(checklist) {
      if (checklist.id == this.openMovableChecklist.id) this.closeMoverChecklist()
      else this.openMoverChecklist(checklist)
    },
  },
}
</script>

<style lang="scss">
.mover-close-checklist-button {
  cursor: pointer;
  color: $list-primary;
  margin-bottom: 10px;
  display: inline-block;
}
</style>
