<template lang="html">
  <ul class="productivity-breadcrumbs list-unstyled">
    <li>
      <a href="/productivity">
        <i class="fa fa-fw fa-home" aria-hidden="true"></i>
        Home
      </a>
    </li>
    <li v-for="ancestor in ancestors">
      <i class="fa fa-fw fa-angle-right" aria-hidden="true"></i>
      <a :href="'/productivity/folder/'+ancestor.fake_id">
        <i class="fa fa-fw fa-folder" aria-hidden="true"></i>
        {{ancestor.name}}
      </a>
    </li>
    <li v-if="resource">
      <i class="fa fa-fw fa-angle-right" aria-hidden="true"></i>
      <template v-if="model=='folder'">
        <i class="fa fa-fw fa-folder" aria-hidden="true"></i>
        {{resource.name}}
      </template>
    </li>
  </ul>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'breadcrumbs',
  props: {
    model: String,
    resource: Object,
  },
  methods: {
    goToListing: function(model, id) {
      return window.location = '/productivity/' + model + 's/' + id
    },
  },
  computed: {
    ...mapGetters([
      'currentFolder',
      'ancestors'
    ])
  }
}
</script>

<style>
  .productivity-breadcrumbs {
    display: inline-block;
    font-size: 1em;
  }
  li {
    display: inline-block;
  }
</style>
