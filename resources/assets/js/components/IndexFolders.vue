<template lang="html">
  <ul
    v-if="foldersByName"
    class="list-unstyled"
    @click.self="clearSelected"
  >
      <li
        v-for="folder in foldersByName"
        class="listing folder-color-scheme"
        :class="{selected: selected.folders.indexOf(folder) !== -1 }"
        draggable="true"
        @click="toggleSelection({selection: {model: 'folder', listing: folder}, event: $event})"
        @dblclick="goToListing('folder', folder.fake_id)"
        v-tooltip.bottom-start="{ content: folder.name, classes: 'folder-tooltip', trigger: 'hover', autoHide: false, container: '#folder-'+folder.fake_id }"
        :key="folder.fake_id"
        :id="'folder-'+folder.fake_id"
      >
          <h5>
            <i class="fas fa-fw fa-folder" aria-hidden="true"/>
            {{ folder.name }}
          </h5>

          <a :href="'/folders/' + folder.fake_id"
              class="go-to-listing"
              v-if="selected.folders.indexOf(folder) !== -1"
          >
            <i class="far fa-angle-double-right" aria-hidden="true"/>
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
      'foldersByName',
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
