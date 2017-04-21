<template lang="html">
  <div class="search-wrapper">
    <form class="search-form" :class="searchFormClass">
      <i class="fa fa-search" aria-hidden="true"></i>

      <search-input></search-input>

      <i class="fa fa-times cancel-search-btn" aria-hidden="true" v-if="search.query" @click="cancel"></i>
    </form>
  </div>

</template>

<script>
import { mapActions, mapGetters } from 'vuex'

import SearchInput from './SearchInput.vue'

export default {
  name: 'search',
  methods: {
    ...mapActions([
      'clearSearchResults',
      'setIsSearching',
      'setSearchErrorMessage'
    ]),
    cancel: function() {
      this.clearSearchResults()
      this.setSearchErrorMessage()
      this.search.query = undefined
      return this.setIsSearching(false)
    }
  },
  computed: {
    ...mapGetters([
      'search'
    ]),
    searchFormClass: function() {
      return this.search.query ? 'has-query' : null
    }
  },
  components: {
    SearchInput
  }
}
</script>

<style lang="css">
</style>
