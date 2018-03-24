<template lang="html">
  <div class="productivity-breadcrumbs">
    <ul class="list-unstyled">
      <li v-if="ancestors.length||currentFolder&&currentFolder.name&&!hasCurrentView&&!currentFolderIsAncestor||hasCurrentView">
        <a href="/">
          <i class="fas fa-fw fa-home " aria-hidden="true"/>
          Home
        </a>
      </li>

      <template v-if="ancestors.length">
        <li v-for="ancestor in ancestors" :class="{ 'current-folder': checklist&&checklist.folder_id==ancestor.id }" :key="ancestor.id">
          <i class="far fa-fw fa-angle-right" aria-hidden="true"/>
          <a :href="'/folders/'+ancestor.fake_id">
            <i class="fas fa-fw fa-folder-open" aria-hidden="true"/>
            {{ ancestor.name | truncate(35) }}
          </a>
        </li>
      </template>

      <li class="current-folder open-folder"
        v-if="currentFolder&&currentFolder.name&&!hasCurrentView&&!currentFolderIsAncestor"
        id="current-folder-breadcrumb"
        v-tooltip.bottom-start="{ content: 'This folder is currently open.', classes: 'folder-tooltip', trigger: 'hover', autoHide: false, container: '#current-folder-breadcrumb' }"
      >
          <i class="far fa-fw fa-angle-right" aria-hidden="true"/>
          <i class="fas fa-fw fa-folder-open" aria-hidden="true"/>
          {{ currentFolder.name | truncate(35) }}
      </li>

      <!-- this section renders the name of the current view of the Home screen -->
      <li v-if="hasCurrentView" class="current-view">
        <template v-if="currentView=='foldersIndex'">
          <i class="far fa-fw fa-angle-right" aria-hidden="true"/>
          <i class="fas fa-fw fa-folder-open" aria-hidden="true"/>
          Folders
        </template>
        <template v-if="currentView=='checklistsIndex'">
          <i class="far fa-fw fa-angle-right" aria-hidden="true"/>
          <i class="far fa-fw fa-list" aria-hidden="true"/>
          Lists
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
    currentView: {
      type: String,
      default: null
    }
  },
  computed: {
    ...mapGetters([
      'currentFolder',
      'ancestors',
      'checklist'
    ]),
    currentFolderIsAncestor: function() {
      return this.ancestors && this.ancestors.length && this.currentFolder ? _.findIndex(this.ancestors, ['id', this.currentFolder.id]) !== -1 : false;
    },
    hasCurrentView: function() {
      return ! _.isEmpty(this.currentView)
    }
  }
}
</script>

<style lang="scss">
.productivity-breadcrumbs {
    // border-left: 1px solid $base-border-color;
    // padding-left: 10px;
    display: inline-block;
    width: 80%;
    font-size: 1em;
    line-height: 2;
    margin: 0;
    margin-top: 2px;
    vertical-align: middle;
    // overflow-x: scroll;
    overflow-x: hidden;
    overflow-y: hidden;
    white-space: nowrap;
    -ms-overflow-style: none;
    color: $brand-primary;

    ::-webkit-scrollbar {
        display: none;
    }
    font-weight: 300;

    .current-view,
    .current-folder {
        font-weight: $font-weight-bold;
    }
    .current-folder.open-folder {
        color: $light-grey-text-color;
    }

    ul {
        display: inline-block;
        margin: 0;
    }

    li {
        display: inline-block;
    }

    .fa-angle-right {
        color: darken($base-border-color, 10%);
    }
}

</style>
