<template lang="html">
  <div class="index-all" @click.self="clearSelected">
    <div class="index-folders" v-if="hasFolders" @click.self="clearSelected">
      <h5>Folders</h5>
      <index-folders/>
    </div>

    <div class="index-files" v-if="hasFiles" @click.self="clearSelected">
      <h5>Files</h5>
      <index-files/>
    </div>

    <p class="notice" v-if="isEmpty">No Files or Folders have been added yet.</p>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import IndexFolders from './IndexFolders.vue'
import IndexFiles from './IndexFiles.vue'

export default {
  name: 'index-all',
  components: {
    IndexFolders,
    IndexFiles
  },
  computed: {
    ...mapGetters([
      'folders',
      'checklists'
    ]),
    hasFolders: function() {
      return this.folders && ! _.isEmpty(this.folders)
    },
    hasFiles: function() {
      return this.checklists && ! _.isEmpty(this.checklists)
    },
    isEmpty: function() {
      return ! this.hasFolders && ! this.hasFiles
    }
  },
  methods: {
    ...mapActions([
      'clearSelected'
    ])
  },
}
</script>

<style lang="scss">
.index-all {
    padding-bottom: 50px;
    min-height: 100%;
}

.index-folders,
.index-files {
    margin: 0;
    padding: 0;
    padding-bottom: 40px;
    h5 {
        margin-bottom: 10px;
        font-weight: $font-weight-light;
    }
}
.index-files {
    // margin-top: 0;
}

li.listing {
    background: white;
    border: 1px solid $base-border-color;
    border-radius: 3px;
    display: inline-block;
    // padding: 0 6px 0 6px;
    padding: 1px 6px;
    margin-right: 12px;
    margin-top: 12px;
    position: relative;

    @media(max-width:767px){
        width: 100%;
    }
    @media(min-width:768px){
        width: 48%;
    }
    @media(min-width:992px){
        width: 30%;
        min-width: 150px;
    }
    @media(min-width:1200px){
        width: 23%;
        min-width: 150px;
    }

    h5 {
        width: 90%;
        vertical-align: middle;
        display: inline-block;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        font-weight: $font-weight-bold;
    }
    a {
        text-decoration: none;
    }

    .go-to-listing {
        float: right;
        padding: 3px;
        margin-top: 4px;
    }

    &.folder-color-scheme {
        &.selected {
            border: 1px solid $folder-primary !important;
            background: $folder-background;
            color: white;

            h5 {
                text-shadow: $folder-text-shadow;
            }
        }
        .go-to-listing {
            color: darken($folder-primary, 10%);
            &:hover {
                color: white;
            }
        }
    }

    &.list-color-scheme {
        &.selected {
            border: 1px solid $list-primary !important;
            background: $list-background;
            color: white;

            h5 {
                text-shadow: $list-text-shadow;
            }
        }
        .go-to-listing {
            color: darken($list-primary, 10%);
            &:hover {
                color: white;
            }
        }
    }
    .item-count-tag {
        position: absolute;
        top: -11px;
        right: 5px;
        font-size: 0.7em;
        background: white;
        color: darken($base-border-color, 15%);
        font-weight: $font-weight-bold;
        border: 1px solid $base-border-color;
        border-radius: 50%;
        min-width: 22px;
        height: 22px;
        text-align: center;
        display: table;

        .item-count {
          display: table-cell;
          text-align: center;
          vertical-align: middle;
        }
    }
    &.selected {
        .item-count-tag {
            border: 1px solid $body-bg;
            background: $list-background;
            color: white !important;
        }
    }
}

</style>
