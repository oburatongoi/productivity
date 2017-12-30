<template lang="html">
  <ul
    v-if="checklists"
    class="list-unstyled"
    @click.self="clearSelected"
  >
      <index-checklists
        v-for="checklist in checklists"
        :checklist="checklist"
        :key="checklist.fake_id"
      />
  </ul>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import IndexChecklists from './IndexChecklists.vue'

export default {
  name: 'index-files',
  components: {
    IndexChecklists
  },
  computed: {
    ...mapGetters([
      'checklists',
      'selected'
    ])
  },
  methods: {
    ...mapActions([
      'clearSelected'
    ])
  },
}
</script>

<style lang="css">
</style>
