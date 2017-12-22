<template lang="html">
  <div class="folder">
    <ul class="folder-nav" id="folder-nav">
      <li :class="{ selected: view=='files' }" @click="setView('files')" id="select-files">Files</li>
      <li :class="{ selected: view=='tasks' }" @click="setView('tasks')" id="select-tasks">Tasks</li>
    </ul>

    <template v-if="view=='files'">
      <index-all/>
      <move-to-folder v-if="selectedIsMovable"/>
    </template>

    <template v-if="view=='tasks'">
      <index-tasks/>
      <move-to-checklist v-if="selectedIsMovable" :replace-after-move="true"/>
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
  components: {
    IndexAll,
    IndexTasks,
    MoveToFolder,
    MoveToChecklist
  },
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
}
</script>
