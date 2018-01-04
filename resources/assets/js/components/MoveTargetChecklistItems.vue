<template lang="html">
  <div class="move-target-checklist-items">
    <div class="info-message" v-if="showInfoMessage">
      <i class="fa fa-spinner fa-spin fa-lg" aria-hidden="true" v-if="isLoading"/>
      <p :class="[checklistItemInfoMessage.type]" v-if="checklistItemInfoMessage.content&&checklistItemInfoMessage.type">{{ checklistItemInfoMessage.content }}</p>
      <p class="info" v-if="checklistItemInfoMessage.content&&checklistItemInfoMessage.type">{{ checklistItemInfoMessage.content }}</p>
    </div>

    <ul class="list-unstyled" v-if="checklistItems&&!isLoading">
      <li class="nested-checklist-item"
          :class="{ active: item.id==selectedChecklistItem.id }"
          v-for="item in checklistItems"
          @click.prevent="selectChecklistItem(item)"
          @dblclick.prevent="selectChecklistItem(item)"
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
export default {
  name: 'move-target-checklist-items',
  props: {
    checklistItems: {
      type: [Object, Array],
      default: () => []
    },
    selectedChecklistItem: {
      type: Object,
      default: () => {}
    },
    isLoading: {
      type: Boolean,
      default: false
    },
    hasChecklistItems: {
      type: Boolean,
      default: false
    },
    checklistItemInfoMessage: {
      type: Object,
      default: function() { return { content: undefined, type: undefined } }
    }
  },
  computed: {
    showInfoMessage: function() {
      return this.isLoading || this.checklistItemInfoMessage.content && this.checklistItemInfoMessage.type
    },
  },
  methods: {
    selectChecklistItem: function(item) {
      this.$eventHub.$emit('selectChecklistItem', item)
    },
  },
}
</script>

<style lang="scss">
.move-target-checklist-items {
  background: white;
  padding: 10px;
}
</style>
