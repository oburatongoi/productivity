<template lang="html">
  <ul class="list-unstyled" @click.self="deselectListing">
      <index-checklists
        v-if="checklists"
        v-for="checklist in checklists"
        :checklist="checklist"
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
      'deselectListing'
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
