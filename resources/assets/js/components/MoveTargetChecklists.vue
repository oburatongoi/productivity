<template lang="html">
  <div class="move-target-checklists">
    <template v-if="!openMovableChecklist.id&&moverContext!='checklist-item'">
      <h5>Lists <span v-if="movableChecklists&&movableChecklists.length">(click to select, doubleclick to open)</span></h5>

      <!-- <small class="text-muted" v-if="movableChecklists&&movableChecklists.length"><i class="far fa-fw fa-lightbulb" aria-hidden="true"/> Click to select, doubleclick to open.</small> -->

      <mover-adder model="checklist"/>

      <div class="info-message" v-if="showChecklistInfoMessage">
        <i class="far fa-spinner fa-spin fa-lg" aria-hidden="true" v-if="moverIsLoading"/>
        <p :class="[checklistInfoMessage.type]" v-if="checklistInfoMessage.content&&checklistInfoMessage.type">{{ checklistInfoMessage.content }}</p>
      </div>
    </template>

    <ul class="list-unstyled" v-if="movableChecklists&&movableChecklists.length&&!moverIsLoading">
      <li v-if="isStoringMovableChecklist">
        <i class="far fa-spinner fa-spin fa-lg" aria-hidden="true"/>
      </li>
      <li class="nested-checklist"
          :class="{ active: checklist.id==selectedMovableChecklist.id, opened: checklist.id==openMovableChecklist.id }"
          v-for="checklist in movableChecklists"
          v-if="!openMovableChecklist.id||checklist.id==openMovableChecklist.id"
          :key="checklist.fake_id"
      >
        <span
          @click.stop.prevent="selectMoverChecklist(checklist)"
          @dblclick.stop.prevent="toggleChecklist(checklist)"
        >
          <i class="far fa-fw fa-list" aria-hidden="true"/>
          {{ checklist.title }}
        </span>
        <i class="far fa-angle-right" aria-hidden="true" @click="fetchChecklistItems(checklist)"/>
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
.move-target-checklists {
  h5 span {
    color: $light-grey-text-color;
    font-weight: 300;
  }
}

.mover-close-checklist-button {
  cursor: pointer;
  color: $list-primary;
  margin-bottom: 10px;
  display: inline-block;
}
</style>
