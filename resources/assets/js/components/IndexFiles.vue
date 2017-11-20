<template lang="html">
  <ul class="list-unstyled" @click.self="clearSelected">
      <index-checklists
        v-if="checklists"
        v-for="checklist in orderBy(checklists, 'title')"
        :checklist="checklist"
        :key="checklist.fake_id"
      ></index-checklists>
  </ul>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import IndexChecklists from './IndexChecklists.vue'

export default {
  name: 'index-files',
  methods: {
    ...mapActions([
      'clearSelected'
    ])
  },
  computed: {
    ...mapGetters([
      'checklists',
      'selected'
    ])
  },
  components: {
    IndexChecklists
  }
}
</script>

<style lang="css">
</style>
