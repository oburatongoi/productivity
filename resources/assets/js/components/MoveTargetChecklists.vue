<template lang="html">
  <div class="move-target-checklists">
    <h4>Lists</h4>
    <div class="info-message" v-if="showChecklistInfoMessage">
      <i class="fa fa-spinner fa-spin fa-lg" aria-hidden="true" v-if="isLoading"/>
      <p :class="[checklistInfoMessage.type]" v-if="checklistInfoMessage.content&&checklistInfoMessage.type">{{ checklistInfoMessage.content }}</p>
    </div>

    <ul class="list-unstyled" v-if="checklists&&!isLoading">
      <li v-if="isStoringChecklist">
        <i class="fa fa-spinner fa-spin fa-lg" aria-hidden="true"/>
      </li>
      <li class="nested-checklist"
          :class="{ active: checklist.id==selectedChecklistId, opened: checklist.id==openChecklistId&&hasChecklistItems }"
          v-for="checklist in checklists"
          :key="checklist.id"
      >
        <span
          @click="selectChecklist(checklist)"
          @dblclick="openChecklist(checklist)"
        >
          <i class="fa fa-fw fa-list" aria-hidden="true"/>
          {{ checklist.title }}
        </span>
        <i class="fa fa-angle-right" aria-hidden="true" @click="fetchChecklistItems(checklist)"/>

        <move-target-checklist-items
          v-if="checklist.id==openChecklistId&&hasChecklistItems"
          :checklist-items="checklistItems"
          :is-loading="isLoading"
          :has-checklist-items="hasChecklistItems"
          :checklist-item-info-message="checklistItemInfoMessage"
          :selected-checklist-item="selectedChecklistItem"
        />
      </li>
    </ul>
  </div>

</template>

<script>
import MoveTargetChecklistItems from './MoveTargetChecklistItems.vue'
export default {
  name: 'move-target-checklists',
  components: {
    MoveTargetChecklistItems,
  },
  props: {
    checklists: {
      type: [Object, Array],
      default: () => []
    },
    checklistItems: {
      type: [Object, Array],
      default: () => []
    },
    openChecklistId: {
      type: [String, Number],
      default: null
    },
    selectedChecklistId: {
      type: [String, Number],
      default: null
    },
    selectedChecklistItem: {
      type: Object,
      default: () => {}
    },
    isLoading: {
      type: Boolean,
      default: false
    },
    isStoringChecklist: {
      type: Boolean,
      default: false
    },
    checklistInfoMessage: {
      type: Object,
      default: function() { return { content: undefined, type: undefined } }
    },
    checklistItemInfoMessage: {
      type: Object,
      default: function() { return { content: undefined, type: undefined } }
    }
  },
  computed: {
    showChecklistInfoMessage: function() {
      return this.isLoading || this.checklistInfoMessage.content && this.checklistInfoMessage.type
    },
    hasChecklistItems: function() {
      return ! _.isEmpty(this.checklistItems)
    },
  },
  methods: {
    selectChecklist: function(checklist) {
      this.$eventHub.$emit('selectChecklist', checklist)
    },
    openChecklist: function(checklist) {
      this.$eventHub.$emit('openChecklist', checklist)
    },
  },
}
</script>

<style lang="scss">

</style>
