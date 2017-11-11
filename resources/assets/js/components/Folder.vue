<template lang="html">
  <div class="folder">
    <ul class="folder-nav">
      <li :class="{ selected: view=='files' }" @click="setView('files')">Files</li>
      <li :class="{ selected: view=='tasks' }" @click="setView('tasks')">Tasks</li>
    </ul>

    <index-all v-if="view=='files'"></index-all>

    <index-tasks v-if="view=='tasks'"></index-tasks>

    <move-to-folder v-if="selectedIsMovable"></move-to-folder>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import IndexAll from './IndexAll.vue'
import IndexTasks from './IndexTasks.vue'
import MoveToFolder from './MoveToFolder.vue'

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
    MoveToFolder
  }
}
</script>
