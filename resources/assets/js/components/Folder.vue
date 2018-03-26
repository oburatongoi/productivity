<template lang="html">
  <div class="show-folder">
    <div id="inner-content-heading" class="inner-content-wrapper">
      <edit-folder-name/>

      <ul class="folder-nav" id="folder-nav">
        <li :class="{ selected: view=='files' }" @click="setView('files')" id="select-files">Files</li>
        <li :class="{ selected: view=='overview' }" @click="setView('overview')" id="select-tasks">Overview</li>
        <li :class="{ selected: view=='tasks' }" @click="setView('tasks')" id="select-tasks">Tasks</li>
      </ul>
    </div>

    <div id="inner-content-body">
      <div class="inner-content-wrapper full-height" v-if="view=='files'||view=='tasks'">
        <template v-if="view=='files'">
          <index-all />
        </template>

        <template v-if="view=='tasks'||view=='overview'">
          <index-tasks />
          <move-to-checklist v-if="selectedIsMovable" :replace-after-move="true"/>
        </template>
      </div>

      <template v-if="view=='overview'">
        <kanban />
      </template>
    </div>
    <resize-observer @notify="debounceResizeContentBody" />
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import EditFolderName from './EditFolderName.vue'
import IndexAll from './IndexAll.vue'
import IndexTasks from './IndexTasks.vue'
import Kanban from './kanban/Kanban.vue'
import MoveToChecklist from './MoveToChecklist.vue'

export default {
  name: 'folder',
  components: {
    EditFolderName,
    IndexAll,
    IndexTasks,
    Kanban,
    MoveToChecklist
  },
  data () {
    return {
      // view: 'files'
      view: 'overview'
    }
  },
  computed: {
    ...mapGetters([
      'selectedIsMovable',
    ]),
  },
  mounted: function() {
    this.resizeContentBody()
  },
  methods: {
    ...mapActions([
      'clearSelected',
    ]),
    setView: function(view) {
      this.clearSelected()
      return this.view = view
    },
    debounceResizeContentBody: _.debounce(function() {
      this.resizeContentBody(true)
    }, 500),
    resizeContentBody: function(emitResize = false) {
      var wideSection = document.getElementById('wide-section'),
          navSizer = document.getElementById('wide-section-nav-sizer'),
          contentWrapper = document.getElementById('content-wrapper'),
          wideSectionHeight = $(wideSection).outerHeight(true),
          navSizerHeight = $(navSizer).outerHeight(true),
          // contentWrapperHeightBefore = $(contentWrapper).outerHeight(true),
          contentWrapperHeight = wideSectionHeight - navSizerHeight

          // console.log('contentWrapperHeightBefore: '+contentWrapperHeightBefore);

      if(contentWrapper) contentWrapper.style.height = contentWrapperHeight + 'px'

      var innerContentHeading = document.getElementById('inner-content-heading'),
          innerContentBody = document.getElementById('inner-content-body'),
          innerContentHeadingHeight = $(innerContentHeading).outerHeight(true),
          innerContentBodyHeight = contentWrapperHeight - innerContentHeadingHeight + 'px'

      if(innerContentBody) innerContentBody.style.height = innerContentBodyHeight

      // console.log('wideSectionHeight: '+wideSectionHeight);
      // console.log('navSizerHeight: '+navSizerHeight);
      // console.log('contentWrapperHeight: '+contentWrapperHeight);
      // console.log('innerContentHeadingHeight: '+innerContentHeadingHeight);
      // console.log('innerContentBodyHeight: '+innerContentBodyHeight);

      if (emitResize) {
        this.$eventHub.$emit('resizeKanban');
      }
    },
  },
}
</script>

<style lang="scss">
.show-folder {
  height: 100%;
  overflow: hidden;

  .index-tasks {
    height: 93%;
  }

  .toggle-edit-btn {
    color: $light-grey-text-color;
    font-size: 0.5em;
    cursor: pointer;
  }

  .folder-nav {
    display: block;
    padding: 0;
    // margin-bottom: 20px;
    margin-bottom: 10px;

    li {
      display: inline-block;
      cursor: pointer;
      &:not(:last-child) {
          margin-right: 20px;
      }
      &.selected {
          border-bottom: 2px solid $folder-primary;
      }
    }
  }
}



</style>
