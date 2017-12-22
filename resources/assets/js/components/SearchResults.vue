<template lang="html">
  <div class="search-results" v-if="search.isSearching||search.query">

    <div class="secondary-search-input">
      <i class="fa fa-search" aria-hidden="true"/>
      <search-input/>
      <i class="fa fa-times" aria-hidden="true" @click="cancel"/>
    </div>

    <i class="fa fa-spinner fa-spin" aria-hidden="true" v-if="search.isSearching"/>

    <ul class="list-unstyled folder-color-scheme" v-if="search.results.folders">
      <li v-for="folder in orderBy(search.results.folders, 'name')" :key="folder.id">
        <a :href="'/folders/'+folder.fake_id">
          <i class="fa fa-fw fa-folder" aria-hidden="true"/>
          {{ folder.name }}
        </a>
      </li>
    </ul>

    <ul class="list-unstyled list-color-scheme" v-if="search.results.checklists">
      <li v-for="checklist in orderBy(search.results.checklists, 'title')" :key="checklist.id">
        <a :href="'/lists/'+checklist.fake_id">
          <i class="fa fa-fw fa-list" aria-hidden="true"/>
          {{ checklist.title }}
        </a>
      </li>
    </ul>

    <p v-if="search.errorMessage" class="error-message">{{ search.errorMessage }}</p>
    <!-- <p v-if="search.query&&!search.isSearching&&!hasSearchResults" class="info-message">There were no files or folders matching your search.</p> -->

    <div class="algolia-image">
      powered by <img src="/vendor/productivity/images/Algolia_logo_bg-white.jpg" alt="Powered by Algolia">
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import SearchInput from './SearchInput.vue'

export default {
  name: 'search-results',
  components: {
    SearchInput
  },
  computed: {
    ...mapGetters([
      'currentFolder',
      'search',
      'hasSearchResults'
    ])
  },
  methods: {
    ...mapActions([
      'clearSearchResults',
      'setSearchQuery',
      'setIsSearching',
      'setSearchErrorMessage'
    ]),
    cancel: function() {
      this.clearSearchResults()
      this.setSearchErrorMessage()
      this.setSearchQuery()
      return this.setIsSearching(false)
    }
  },
}
</script>

<style lang="css">
</style>
