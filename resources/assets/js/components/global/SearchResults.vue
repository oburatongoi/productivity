<template lang="html">
  <div class="search-results">
    <div class="search-results-wrapper">
      <div class="secondary-search-input">

        <i class="far fa-search" aria-hidden="true"/>

        <search-input/>

        <i class="far fa-times" aria-hidden="true" @click="cancel"/>

      </div>

      <div class="algolia-image">
        powered by <img src="/vendor/productivity/images/Algolia_logo_bg-white.jpg" alt="Powered by Algolia">
      </div>

      <div class="results-container">

        <i
        class="far fa-spinner fa-spin"
        aria-hidden="true"
        v-if="search.isSearching" />

        <ul
        class="list-unstyled folder-color-scheme"
        v-if="searchResultHasFolders" >

          <li
          v-for="folder in alphabeticalFolderSearchResults"
          :key="folder.id" >

            <a :href="'/folders/'+folder.fake_id">
              <i class="fas fa-fw fa-folder" aria-hidden="true"/>

              {{ folder.name }}
            </a>

          </li>

        </ul>

        <ul class="list-unstyled list-color-scheme" v-if="searchResultHasChecklists">
          <li v-for="checklist in alphabeticalChecklistSearchResults" :key="checklist.id">
            <a :href="'/lists/'+checklist.fake_id">
              <i class="far fa-fw fa-list" aria-hidden="true"/>
              {{ checklist.title }}
            </a>
          </li>
        </ul>

        <p v-if="search.errorMessage" class="error-message">{{ search.errorMessage }}</p>
        <!-- <p v-if="search.query&&!search.isSearching&&!hasSearchResults" class="info-message">There were no files or folders matching your search.</p> -->
        <!-- <div class="algolia-image">
          powered by <img src="/vendor/productivity/images/Algolia_logo_bg-white.jpg" alt="Powered by Algolia">
        </div> -->
      </div>
      <div class="search-results-bottom-gradient"/>
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
      'setSearchability',
      'setSearchErrorMessage'
    ]),
    cancel: function() {
      this.clearSearchResults()
      this.setSearchErrorMessage()
      this.setSearchQuery()
      return this.setSearchability(false)
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
  @include high-z-index(1);
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

  .secondary-search-input {
      width: 100%;
      line-height: 40px;
      border: 1px solid $base-border-color;
      border-radius: 25px;
      margin-top: 40px;
      margin-bottom: 5px;
      padding: 0 10px 0 10px;

      input {
          outline: none;
          border: 0;
          height: 40px;
          padding: 5px 10px;
          width: 90%;
          display: inline-block;
      }

      .far, .fas, .fal {
          font-size: 1.2em;
          color: darken($base-border-color, 10%);
      }

      .fa-times {
          float: right;
          margin-top: 12px;
          cursor: pointer;
      }
  }

  .secondary-search-input,
  .error-message {
      font-weight: $font-weight-normal;
  }

  .search-results-wrapper {
    width: 100%;
    height: 100%;
    overflow: hidden;
    position: relative;
  }

  .results-container {
    height: 90%;
    padding-bottom: 10%;
    overflow-y: scroll;
  }
  .search-results-bottom-gradient {
    position: sticky;
    bottom: 0;
    width: 100%;
    height: 40px;
    @include transparent-linear-gradient;
  }

  ul {
      margin: 0;
      li {
          margin-bottom: 5px;
          font-size: 1.2em;
      }
  }

  .algolia-image {
      margin-bottom: 20px;
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

  .folder-color-scheme mark {
      background: #E5F5FF;
  }

  .list-color-scheme mark {
      background: #DEF2E3;
  }
}
</style>
