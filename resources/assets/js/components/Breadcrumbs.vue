<template lang="html">
  <div class="productivity-breadcrumbs">
    <ul class="list-unstyled">
      <li>
        <a href="/productivity">
          <i class="fa fa-fw fa-home" aria-hidden="true"></i>
          Home
        </a>
      </li>
      <li v-for="ancestor in ancestors">
        <i class="fa fa-fw fa-angle-right" aria-hidden="true"></i>
        <a :href="'/productivity/folders/'+ancestor.fake_id">
          <i class="fa fa-fw fa-folder" aria-hidden="true"></i>
          {{ancestor.name}}
        </a>
      </li>
      <li v-if="currentFolder.id">
        <i class="fa fa-fw fa-angle-right" aria-hidden="true"></i>
        <template v-if="model=='folder'">
          <i class="fa fa-fw fa-folder" aria-hidden="true"></i>
          {{currentFolder.name}}
        </template>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'breadcrumbs',
  props: {
    model: String
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

</style>
