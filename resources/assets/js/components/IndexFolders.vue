<template lang="html">
  <ul class="list-unstyled" @click.self="deselectListing">
      <li
        v-if="folders"
        v-for="folder in folders"
        class="listing folder-color-scheme"
        :class="{selected: selected.id==folder.fake_id&&selected.model=='folder'}"
        draggable="true"
        @click="selectListing({model: 'folder', id: folder.fake_id, listing: folder})"
        @dblclick.prevent="goToListing('folder', folder.fake_id)"
        v-tooltip.bottom-left="folder.name"
      >
          <h5>
            <i class="fa fa-fw fa-folder" aria-hidden="true"></i>
            {{folder.name}}
          </h5>

          <a :href="'/productivity/folders/' + folder.fake_id"
              class="go-to-listing"
              v-if="selected.id==folder.fake_id&&selected.model=='folder'"
          >
            <i class="fa fa-angle-double-right" aria-hidden="true"></i>
          </a>
      </li>
  </ul>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'index-folders',
  methods: {
    ...mapActions([
      'selectListing',
      'deselectListing'
    ]),
    goToListing: function(model, id) {
      return window.location = '/productivity/' + model + 's/' + id
    }
  },
  computed: {
    ...mapGetters([
      'folders',
      'selected'
    ])
  },
}
</script>

<style lang="css">
</style>
