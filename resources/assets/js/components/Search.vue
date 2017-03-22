<template lang="html">
  <div class="search-wrapper">
    <form class="search-form" @submit.prevent="search">
      <input type="search" class="form-control input-sm" v-model="query" placeholder="Search...">
      <button type="button" class="btn btn-default btn-sm" v-if="query" @click="cancel"><i class="fa fa-times" aria-hidden="true"></i></button>
      <button type="submit" class="btn btn-primary btn-sm" v-if="query"><i class="fa fa-search" aria-hidden="true"></i></button>
    </form>

    <div class="search-results" v-if="query&&hasResults||searching">
      <i class="fa fa-spinner fa-spin" aria-hidden="true" v-if="searching"></i>
      <ul class="list-unstyled folder-color-scheme" v-if="results.folders">
        <li v-for="folder in results.folders">
          <i class="fa fa-fw fa-folder" aria-hidden="true"></i>
          <a :href="'/productivity/folders/'+folder.fake_id">{{folder.name}}</a>
        </li>
      </ul>

      <ul class="list-unstyled list-color-scheme" v-if="results.checklists">
        <li v-for="checklist in results.checklists">
          <i class="fa fa-fw fa-list" aria-hidden="true"></i>
          <a :href="'/productivity/lists/'+checklist.fake_id">{{checklist.title}}</a>
        </li>
      </ul>
    </div>
  </div>

</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'search',
  data () {
    return {
      query: undefined,
      results: {
        folders: {},
        checklists: {}
      },
      searching: false
    }
  },
  methods: {
    search: function() {
      this.searching = true
      this.$http.post('/productivity/search', {currentFolderId: this.currentFolder.id, query: this.query}).then(
        (response) => this.handleSuccessfulSearch(response),
        (response) => this.handleSearchError(response)
      )
    },
    handleSuccessfulSearch: function(response) {
      this.searching = false
      response.data.results ? this.results = response.data.results : this.clearResults()
    },
    handleSearchError: function(response) {
      this.searching = false
      console.log(response);
    },
    cancel: function() {
      this.clearResults()
      this.query = undefined
      return this.searching = false
    },
    clearResults: function() {
      return this.results = {
        folders: {},
        checklists: {}
      }
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
