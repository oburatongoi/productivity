<template lang="html">
  <div class="move-target-checklists">
    <template v-if="!openMovableChecklist.id&&moverContext!='checklist-item'">
      <h5>Lists</h5>
      <mover-adder model="checklist"/>

      <div class="info-message" v-if="showChecklistInfoMessage">
        <i class="fa fa-spinner fa-spin fa-lg" aria-hidden="true" v-if="moverIsLoading"/>
        <p :class="[checklistInfoMessage.type]" v-if="checklistInfoMessage.content&&checklistInfoMessage.type">{{ checklistInfoMessage.content }}</p>
      </div>
    </template>

    <span
      class="mover-close-checklist-button"
      @click="closeChecklist"
      v-if="openMovableChecklist.id"
    >
      <i class="fa fa-fw fa-arrow-left"/>
      <span>Back</span>
    </span>

    <ul class="list-unstyled" v-if="movableChecklists&&!moverIsLoading">
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
          @click.stop.prevent="selectChecklist(checklist)"
          @dblclick.stop.prevent="toggleChecklist(checklist)"
        >
          <i class="fa fa-fw fa-list" aria-hidden="true"/>
          {{ checklist.title }}
        </span>
        <i class="fa fa-angle-right" aria-hidden="true" @click="fetchChecklistItems(checklist)"/>

        <move-target-checklist-items
          v-if="checklist.id==openMovableChecklist.id"
        />
      </li>
    </ul>
  </div>

</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import MoverAdder from './MoverAdder.vue'
import MoveTargetChecklistItems from './MoveTargetChecklistItems.vue'
export default {
  name: 'move-target-checklists',
  components: {
    MoverAdder,
    MoveTargetChecklistItems,
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
      'fetchChecklistItems',
      'refreshChecklistItems',
      'resetInfoMessage',
      'deselectMoverSelected',
      'setInfoMessage',
      'setMoverVariable',
      'toggleMoverVariable',
    ]),

    closeChecklist: function() {
      this.setMoverVariable({ variable: 'openMovableChecklist', value: {} })
      this.setMoverVariable({ variable: 'moverContext', value: 'folder' })
      this.refreshChecklistItems()
    },

    selectChecklist: function(checklist) {
      this.toggleMoverVariable({ variable: 'moverIsAddingFolder', value: false })
      this.toggleMoverVariable({ variable: 'moverIsAddingChecklist', value: false })
      if(checklist.id != this.selectedMovableChecklist.id ) {
        this.deselectMoverSelected()
        this.refreshChecklistItems()
        this.setMoverVariable({ variable: 'selectedMovableChecklist', value: checklist })
      }
      if (checklist.id == this.openMovableChecklist.id) this.closeChecklist() // toggle openMovableChecklist.id
    },

    toggleChecklist: function(checklist) {
      if (checklist.id == this.openMovableChecklist.id) this.closeChecklist()
      else this.openChecklist(checklist)
    },

    openChecklist: function(checklist) {
      this.setMoverVariable({ variable: 'openMovableChecklist', value: checklist})
      this.setMoverVariable({ variable: 'moverContext', value: 'checklist' })
      this.fetchChecklistItems(checklist)
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
