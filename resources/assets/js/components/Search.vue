<template lang="html">
  <div class="search-wrapper">
    <form class="search-form" @submit.prevent="search">
      <i class="fa fa-search" aria-hidden="true"></i>
      <input type="search" class="search-input" v-model="query" placeholder="SEARCH" v-on:keyup="search" v-on:keyup.delete="clearResults">
      <i class="fa fa-times cancel-search-btn" aria-hidden="true" v-if="query" @click="cancel"></i>
    </form>

    <div class="search-results" v-if="query&&hasResults||isSearching">
      <i class="fa fa-spinner fa-spin" aria-hidden="true" v-if="isSearching"></i>
      <ul class="list-unstyled folder-color-scheme" v-if="results.folders">
        <li v-for="folder in results.folders">
          <a :href="'/productivity/folders/'+folder.fake_id">
            <i class="fa fa-fw fa-folder" aria-hidden="true"></i>
            {{folder.name}}
          </a>
        </li>
      </ul>

      <ul class="list-unstyled list-color-scheme" v-if="results.checklists">
        <li v-for="checklist in results.checklists">
          <a :href="'/productivity/lists/'+checklist.fake_id">
            <i class="fa fa-fw fa-list" aria-hidden="true"></i>
            {{checklist.title}}
          </a>
        </li>
      </ul>
      <p v-if="errorMessage" class="error-message">{{errorMessage}}</p>
      <div class="algolia-image">
        powered by <img src="/vendor/productivity/images/Algolia_logo_bg-white.jpg" alt="Powered by Algolia">
      </div>
    </div>
  </div>

</template>

<script>
import { mapGetters } from 'vuex'
import Mark from 'mark.js'

export default {
  name: 'search',
  data () {
    return {
      query: undefined,
      results: {
        folders: {},
        checklists: {}
      },
      errorMessage: undefined,
      isSearching: false
    }
  },
  methods: {
    search: _.debounce(function() {
      this.clearErrorMessage()
      // this.clearResults()
      this.isSearching = true
      axios.post('/productivity/search', {currentFolderId: this.currentFolder.id, query: this.query})
      .then(
        (response) => this.handleSuccessfulSearch(response)
      )
      .catch(
        (response) => this.handleSearchError(response)
      )
    }, 300),
    handleSuccessfulSearch: function(response) {
      this.isSearching = false
      response.data.results ? this.results = response.data.results : this.clearResults()
      var markSearchResults = new Mark(document.querySelector(".search-results"));
      var keyword = this.query,
          options = {
            // "accuracy": {
            //   "value": "partially",
            //   "limiters": [",", ".", "-", "/"]
            // }
          };
      this.$nextTick(function () {
        markSearchResults.unmark({
          done: function() {
            markSearchResults.mark(keyword, options)
          }
        })
      })
    },
    handleSearchError: function(response) {
      this.isSearching = false
      this.errorMessage = "An error occurred while searching"
    },
    cancel: function() {
      this.clearResults()
      this.clearErrorMessage()
      this.query = undefined
      return this.isSearching = false
    },
    clearResults: function() {
      return this.results = {
        folders: {},
        checklists: {}
      }
    },
    clearErrorMessage: function() {
      return this.errorMessage = undefined
    }
  },
  computed: {
    ...mapGetters([
      'currentFolder'
    ]),
    hasResults: function() {
      return this.results
              && (
                (this.results.folders && this.results.folders.length)
                || (this.results.checklists && this.results.checklists.length)
              )
    }
  },
}
</script>

<style lang="css">
</style>
