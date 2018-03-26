<template lang="html">
  <div class="global">
    <search-results v-if="search.isSearchable" />
    <notices />
    <create-new v-if="showCreatingNewButtons||creatingNew"/>
    <move-to-folder v-if="selectedIsMovable"/>
  </div>
</template>

<script>
// import { mapActions, mapGetters } from 'vuex'
import { mapGetters } from 'vuex'
import CreateNew from './CreateNew.vue'
import MoveToFolder from './MoveToFolder.vue'
import Notices from './Notices.vue'
import SearchResults from './SearchResults.vue'

export default {
  name: 'global',
  components: {
    CreateNew,
    MoveToFolder,
    Notices,
    SearchResults,
  },
  computed: {
    ...mapGetters([
      'creatingNew',
      'search',
      'selectedIsMovable',
      'showCreatingNewButtons',
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
