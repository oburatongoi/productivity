<template lang="html">
  <ul
    v-if="folders"
    class="list-unstyled"
    @click.self="clearSelected"
  >
      <li
        v-for="folder in folders"
        class="listing folder-color-scheme"
        :class="{selected: selected.folders.indexOf(folder) !== -1 }"
        draggable="true"
        @click="toggleSelection({selection: {model: 'folder', listing: folder}, event: $event})"
        @dblclick="goToListing('folder', folder.fake_id)"
        v-tooltip.bottom-left="folder.name"
        :key="folder.fake_id"
      >
          <h5>
            <i class="fa fa-fw fa-folder" aria-hidden="true"/>
            {{ folder.name }}
          </h5>

          <a :href="'/folders/' + folder.fake_id"
              class="go-to-listing"
              v-if="selected.folders.indexOf(folder) !== -1"
          >
            <i class="fa fa-angle-double-right" aria-hidden="true"/>
          </a>
      </li>
  </ul>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'index-folders',
  computed: {
    ...mapGetters([
      'folders',
      'selected'
    ])
  },
  methods: {
    ...mapActions([
      'clearSelected',
      'toggleSelection'
    ]),
    goToListing: function(model, id) {
      return window.location = '/' + model + 's/' + id
    },
    isSelected: function(listing) {
      return this.selected.folders.indexOf(listing) !== -1
    }
  },
}
</script>

<style lang="css">
</style>
