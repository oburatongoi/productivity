<template lang="html">
  <div class="search-results" v-if="search.isSearching||search.query">

    <div class="secondary-search-input">
      <i class="fa fa-search" aria-hidden="true"/>
      <search-input/>
      <i class="fa fa-times" aria-hidden="true" @click="cancel"/>
    </div>

    <i class="fa fa-spinner fa-spin" aria-hidden="true" v-if="search.isSearching"/>

    <ul class="list-unstyled folder-color-scheme" v-if="searchResultHasFolders">
      <li v-for="folder in alphabeticalFolderSearchResults" :key="folder.id">
        <a :href="'/folders/'+folder.fake_id">
          <i class="fa fa-fw fa-folder" aria-hidden="true"/>
          {{ folder.name }}
        </a>
      </li>
    </ul>

    <ul class="list-unstyled list-color-scheme" v-if="searchResultHasChecklists">
      <li v-for="checklist in alphabeticalChecklistSearchResults" :key="checklist.id">
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
      'alphabeticalChecklistSearchResults',
      'alphabeticalFolderSearchResults',
      'currentFolder',
      'search',
      'searchResultHasFolders',
      'searchResultHasChecklists',
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

<style lang="scss">
.search-results {
  display: block;
  width: 100%;
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  z-index: 9999999999999999;
  background: rgba(255,255,255,1);
  -webkit-box-shadow: 0px 1px 2px 0px rgba(0,0,0,0.3);
  -moz-box-shadow: 0px 1px 2px 0px rgba(0,0,0,0.3);
  box-shadow: 0px 1px 2px 0px rgba(0,0,0,0.3);
  padding: 10px 6px;
  border-radius: 3px;
  font-weight: $font-weight-bold;

  @media(min-width:768px){
      padding: 0px 100px 20px;
  }

  @media(min-width:1200px){
      padding: 0px 200px 20px;
  }

  .secondary-search-input,
  .error-message {
      font-weight: $font-weight-normal;
  }

  ul {
      margin: 0;
      li {
          margin-bottom: 5px;
          font-size: 1.2em;
      }
  }

  .algolia-image {
      border-top: 1px solid $base-border-color;
      margin-top: 30px;
      padding-top: 3px;
      text-align: right;
      font-size: 0.9em;
      img {
          height: 1em;
      }
  }
  mark {
      margin: 0;
      padding: 0;
      color: inherit;
  }
}
</style>
