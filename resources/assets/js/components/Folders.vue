<template lang="html">
  <div class="folders">
    <div class="index-folders" @click.self="clearSelected">
      <h3>
        <i class="fas fa-fw fa-folder" aria-hidden="true"/>
        Folders
      </h3>

      <index-folders/>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import IndexFolders from './IndexFolders.vue'

export default {
  name: 'folders',
  components: {
    IndexFolders,
  },
  methods: {
    ...mapActions([
      'clearSelected'
    ])
  },
}
</script>

<style lang="scss">
  .folders {
    padding: 0 20px;
    margin: 0;
    height: 100%;
    // background: white;

    .index-folders {
      h3 {
        color: $brand-primary;
      }
    }
  }
</style>
