<template lang="html">
  <div class="search-results" v-if="search.query&&hasSearchResults||search.isSearching">
    <i class="fa fa-times" aria-hidden="true" @click="cancel"></i>

    <h5>Searching for: {{search.query}}</h5>

    <i class="fa fa-spinner fa-spin" aria-hidden="true" v-if="search.isSearching"></i>

    <ul class="list-unstyled folder-color-scheme" v-if="search.results.folders">
      <li v-for="folder in search.results.folders">
        <a :href="'/productivity/folders/'+folder.fake_id">
          <i class="fa fa-fw fa-folder" aria-hidden="true"></i>
          {{folder.name}}
        </a>
      </li>
    </ul>

    <ul class="list-unstyled list-color-scheme" v-if="search.results.checklists">
      <li v-for="checklist in search.results.checklists">
        <a :href="'/productivity/lists/'+checklist.fake_id">
          <i class="fa fa-fw fa-list" aria-hidden="true"></i>
          {{checklist.title}}
        </a>
      </li>
    </ul>

    <p v-if="search.errorMessage" class="error-message">{{search.errorMessage}}</p>

    <div class="algolia-image">
      powered by <img src="/vendor/productivity/images/Algolia_logo_bg-white.jpg" alt="Powered by Algolia">
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'search-results',
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
  computed: {
    ...mapGetters([
      'currentFolder',
      'search',
      'hasSearchResults'
    ])
  }
}
</script>

<style lang="css">
</style>
