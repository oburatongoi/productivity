<template lang="html">
  <ul class="list-unstyled" @click.self="deselectListing">
      <index-checklists
        v-if="checklists"
        v-for="checklist in checklists"
        :checklist="checklist"
      ></index-checklists>
      
      <index-notes
        v-if="notes"
        v-for="note in notes"
        :checklist="note"
      ></index-notes>
      
      <index-goals
        v-if="goals"
        v-for="goal in goals"
        :checklist="goal"
      ></index-goals>
  </ul>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import IndexChecklists from './IndexChecklists.vue'
import IndexNotes from './IndexNotes.vue'
import IndexGoals from './IndexGoals.vue'

export default {
  name: 'index-files',
  methods: {
    ...mapActions([
      'deselectListing'
    ])
  },
  computed: {
    ...mapGetters([
      'checklists',
      'notes',
      'goals',
      'selected'
    ])
  },
  components: {
    IndexChecklists,
    IndexNotes,
    IndexGoals
  }
}
</script>

<style lang="css">
</style>
