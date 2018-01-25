<template lang="html">
  <div class="kanban-wrapper" id="kanban-wrapper">
    <draggable
      id="kanban"
      class="kanban"
      :element="'ul'"
      :options="{ draggable: '.kanban-card' }"
    >
      <kanban-card v-for="card in kanbanCards" :key="card.model+'-'+card.id" :card="card"/>
    </draggable>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Draggable from 'vuedraggable'
import KanbanCard from './KanbanCard.vue'
export default {
  name: 'kanban',
  components: {
      Draggable,
      KanbanCard
  },
  computed: {
    ...mapGetters([
      'kanbanCards',
    ]),
  },
  created: function() {
    this.$eventHub.$on('resizeKanban', this.resizeKanban);
  },
  beforeDestroy: function() {
    this.$eventHub.$off('resizeKanban', this.resizeKanban);
  },
  mounted: function() {
    this.$nextTick( function () {
      this.resizeKanban()
    })
  },
  methods: {
    resizeKanban: function() {
      var kanban = document.getElementById('kanban'),
          kanbanHeight = kanban ? $(kanban).outerHeight(true) : 0,
          kanbans = kanban.getElementsByClassName('kanban-card');
          for (var i = 0; i < kanbans.length; i++) {
            var body = kanbans[i].querySelector('.kanban-card-body'),
                heading = kanbans[i].querySelector('.kanban-card-heading'),
                footer = kanbans[i].querySelector('.kanban-card-footer'),
                headingHeight = heading ? $(heading).outerHeight(true) : 0,
                footerHeight = footer ? $(footer).outerHeight(true) : 10,
                computedBodyHeight = kanbanHeight - 0 - headingHeight - footerHeight,
                computedPadding = footerHeight ? footerHeight + 10 : 0
            if(computedBodyHeight) body.style.maxHeight = computedBodyHeight + 'px'
            if(computedPadding) body.style.paddingBottom = computedPadding + 'px'
          }
    },
  }
}
</script>

<style lang="scss">
.kanban-wrapper {
  border-top: 1px solid $base-border-color;
  width: 100%;
  height: 100%;
  background: white;
  // padding: 20px 0 0 20px;
  padding: 20px 0 0 0;
  overflow: hidden;
}
.kanban {
  overflow-y: hidden;
  overflow-x: scroll;
  height: 100%;
  width: auto;
  min-width: 100%;
  background: white;
  white-space: nowrap;
  list-style: none;
  padding: 0;
  margin: 0;

}


</style>
