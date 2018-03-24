<template lang="html">
  <div class="global">
    <search-results v-if="search.isSearchable" />
    <notices />
    <create-new v-if="showCreatingNewButtons||creatingNew"/>
  </div>
</template>

<script>
// import { mapActions, mapGetters } from 'vuex'
import { mapGetters } from 'vuex'
import CreateNew from './CreateNew.vue'
import Notices from './Notices.vue'
import SearchResults from './SearchResults.vue'

export default {
  name: 'global',
  components: {
    CreateNew,
    Notices,
    SearchResults,
  },
  computed: {
    ...mapGetters([
      'search',
      'showCreatingNewButtons',
      'creatingNew',
    ])
  },
  // methods: {
  //   ...mapActions([
  //     'toggleCreatingNewButtons'
  //   ])
  // },
}
</script>

<style lang="scss">
</style>
