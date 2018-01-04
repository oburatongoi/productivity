<template lang="html">
  <div class="move-target-folders">
    <h4>Folders</h4>
    <div class="info-message" v-if="showFolderInfoMessage">
      <i class="fa fa-spinner fa-spin fa-lg" aria-hidden="true" v-if="isLoading"/>
      <p :class="[folderInfoMessage.type]" v-if="folderInfoMessage.content&&folderInfoMessage.type">{{ folderInfoMessage.content }}</p>
    </div>

    <ul class="list-unstyled" v-if="folders&&!isLoading">
      <li v-if="isStoringFolder">
        <i class="fa fa-spinner fa-spin fa-lg" aria-hidden="true"/>
      </li>
      <li class="nested-folder"
          v-for="folder in folders"
          @click.prevent="openFolder(folder)"
          @dblclick.prevent="openFolder(folder)"
          :key="folder.id"
      >
        <span>
          <i class="fa fa-fw fa-folder" aria-hidden="true"/>
          {{ folder.name }}
        </span>
        <i class="fa fa-angle-right" aria-hidden="true" @click="openFolder(folder)"/>
      </li>
    </ul>
  </div>

</template>

<script>
export default {
  name: 'move-target-folders',
  props: {
    folders: {
      type: [Object, Array],
      default: () => []
    },
    isLoading: {
      type: Boolean,
      default: false
    },
    isStoringFolder: {
      type: Boolean,
      default: false
    },
    folderInfoMessage: {
      type: Object,
      default: function() { return { content: undefined, type: undefined } }
    }
  },
  computed: {
    showFolderInfoMessage: function() {
      return this.isLoading || this.folderInfoMessage.content && this.folderInfoMessage.type
    },
  },
  methods: {
    openFolder: function(folder) {
      this.$eventHub.$emit('openFolder', folder)
    },
  },
}
</script>

<style lang="scss">

</style>
