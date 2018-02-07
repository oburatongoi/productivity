<template lang="html">
  <div class="kanban-wrapper" id="kanban-wrapper">
    <!-- <draggable
      id="kanban"
      class="kanban"
      :element="'ul'"
      :options="{ draggable: '.kanban-card' }"
    > -->
    <ul
    id="kanban"
    class="kanban">

      <kanban-card
      v-for="card in kanbanCards"
      :key="card.model+'-'+card.id"
      :card="card" />

    </ul>
    <!-- </draggable> -->

    <kanban-preview
    v-if="kanbanPreview.id"
    :listing="kanbanPreview" />

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
// import Draggable from 'vuedraggable'
import KanbanCard from './KanbanCard.vue'
import KanbanPreview from './KanbanPreview.vue'
export default {
  name: 'kanban',
  components: {
      // Draggable,
      KanbanCard,
      KanbanPreview,
  },
  computed: {
    ...mapGetters([
      'kanbanCards',
      'kanbanPreview',
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
                footerHeight = footer ? $(footer).outerHeight(true) : 50,
                computedBodyHeight = kanbanHeight - headingHeight - footerHeight,
                computedPadding = footer && footerHeight ? footerHeight + 10 : 10
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
  // background: white;
  background: $body-bg;
  // padding: 20px 0 0 20px;
  padding: 20px 0 0 0;
  overflow: hidden;
  position: relative;
}
.kanban {
  overflow-y: hidden;
  overflow-x: scroll;
  height: 100%;
  width: auto;
  min-width: 100%;
  // background: white;
  background: $body-bg;
  white-space: nowrap;
  list-style: none;
  padding: 0;
  margin: 0;
  padding-right: 700px;

  ul {
    padding: 0;
    margin: 0;
    list-style: none;
  }

}


</style>
