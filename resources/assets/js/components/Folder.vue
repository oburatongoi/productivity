<template lang="html">
  <div class="folder">
    <ul class="folder-nav">
      <li :class="{ selected: view=='files' }" @click="setView('files')">Files</li>
      <li :class="{ selected: view=='tasks' }" @click="setView('tasks')">Tasks</li>
    </ul>

    <template v-if="view=='files'">
      <index-all></index-all>
      <move-to-folder v-if="selectedIsMovable"></move-to-folder>
    </template>

    <template v-if="view=='tasks'">
      <index-tasks></index-tasks>
      <move-to-checklist v-if="selectedIsMovable" :replace-after-move="true"></move-to-checklist>
    </template>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import IndexAll from './IndexAll.vue'
import IndexTasks from './IndexTasks.vue'
import MoveToFolder from './MoveToFolder.vue'
import MoveToChecklist from './MoveToChecklist.vue'

export default {
  name: 'folder',
  data () {
    return {
      view: 'files'
    }
  },
  computed: {
    ...mapGetters([
      'selectedIsMovable'
    ])
  },
  methods: {
    ...mapActions([
      'clearSelected'
    ]),
    setView: function(view) {
      this.clearSelected()
      return this.view = view
    }
  },
  components: {
    IndexAll,
    IndexTasks,
    MoveToFolder,
    MoveToChecklist
  }
}
</script>
