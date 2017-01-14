<template lang="html">
  <div>
      <ul class="list-unstyled">
          <li v-if="folders" v-for="folder in folders">
              <folder :folder="folder"></folder>
          </li>
          <li v-if="notes" v-for="note in notes">
              <note :note="note"></note>
          </li>
          <li v-if="checklists" v-for="checklist in checklists">
              <checklist :checklist="checklist"></checklist>
          </li>
          <li v-if="goals" v-for="goal in goals">
              <goal :goal="goal"></goal>
          </li>
      </ul>
  </div>
</template>

<script>
import Folder from './Folder.vue'
import Note from './Note.vue'
import Checklist from './Checklist.vue'
import Goal from './Goal.vue'
export default {
    name: 'folders-index',
    props: ['folders', 'notes', 'goals', 'checklists'],
    components: {
        Folder,
        Note,
        Checklist,
        Goal
    }
}
</script>
