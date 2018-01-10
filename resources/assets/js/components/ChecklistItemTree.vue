<template lang="html">
  <div class="panel side-panel checklist-item-tree">
    <div class="panel-body">
      <h4 class="rabbit-hole">{{ rabbitHoleText }}</h4>
      <small class="text-muted">...here are some breadcrumbs to find your way back. {{ rabbitHoleHashtag }}</small>
      <ul>
        <li
        class="item"
        @click="emitClick({ selection: {model: 'home'}, event: $event})"
        >
          <i class="fa fa-fw fa-home" aria-hidden="true"/>
          Home
        </li>

        <li v-if="folder"><ul class="nested-tree">
          <checklist-item-tree-folder
            v-if="folder"
            :folder="folder"
          />

          <!-- Nested Checklist -->
          <li><ul class="nested-tree">
              <checklist-item-tree-checklist
                v-if="checklist"
                :checklist="checklist"
              />
              <!-- Nested ChecklistItem -->
              <li>
                <checklist-item-tree-item
                  :item="item"
                />
              </li>
              <!-- End Nested ChecklistItem -->
          </ul></li>
          <!-- End Nested Checklist -->

        </ul></li>

        <li v-if="!folder"><ul class="nested-tree">
          <checklist-item-tree-checklist
            v-if="checklist"
            :checklist="checklist"
          />
          <!-- Nested ChecklistItem -->
          <li>
            <checklist-item-tree-item
              :item="item"
            />
          </li>
          <!-- End Nested ChecklistItem -->
        </ul></li>

      </ul>
    </div>
  </div>
</template>

<script>
import ChecklistItemTreeFolder from './ChecklistItemTreeFolder.vue'
import ChecklistItemTreeChecklist from './ChecklistItemTreeChecklist.vue'
import ChecklistItemTreeItem from './ChecklistItemTreeItem.vue'
export default {
  name: 'checklist-item-tree',
  components: {
    ChecklistItemTreeFolder,
    ChecklistItemTreeChecklist,
    ChecklistItemTreeItem
  },
  props: {
    folder: {
      type: Object,
      default: null
    },
    checklist: {
      type: Object,
      default: null
    },
    item: {
      type: Object,
      required: true
    },
    parentComponent: {
      type: String,
      required: true
    }
  },
  computed: {
    rabbitHoleText: function() {
      let phrases = ['Uh, this is getting deep...', 'Hmmm, nice rabbit hole...', 'You\'re taking this to a whole other level...' ],
          randomIndex = Math.floor(Math.random()*phrases.length);
      return phrases[randomIndex]
    },
    rabbitHoleHashtag: function() {
      let phrases = ['#GotYourSix', '#ThankMeNow', '#KeepItClassy' ],
          randomIndex = Math.floor(Math.random()*phrases.length);
      return phrases[randomIndex]
    },
  },
  created: function() {
    this.$eventHub.$on('selectTreeLeaf', this.selectTreeLeaf);
  },
  beforeDestroy: function() {
    this.$eventHub.$off('selectTreeLeaf', this.selectTreeLeaf);
  },
  methods: {
    selectTreeLeaf: function(payload) {
      if (payload.selection.model == 'checklist' && this.parentComponent == 'index-tasks') {
        return window.location.href = '/lists/'+payload.selection.listing.fake_id
      }
      if (payload.selection.model == 'home' && this.parentComponent == 'checklist') {
        return window.location.href = '/'
      }
      if (payload.selection.model == 'folder') {
        return window.location.href = '/folders/'+payload.selection.listing.fake_id
      }
      this.$emit('onSelection', payload)
    }
  },
}
</script>

<style lang="scss">
.checklist-item-tree {
  font-size: 1.1em;
  overflow-x: scroll;
  .panel-body {
    height: 100%;
    overflow-y: scroll;
    width: auto;
    & > ul {
      margin-top: 20px;
    }
  }

  .rabbit-hole {
    margin-bottom: 5px;
  }

  ul {
    list-style: none;
    // padding-left: 20px;
    padding: 0;
    margin-top: 0;
  }
  li.item {
    cursor: pointer;
    &:hover {
      color: $brand-primary;
    }
    &.selected,
    &.active {
      border-radius: 2px;
    }
    &.selected {
      border: 1px dotted $base-border-color;
      background: $body-bg;
    }
    &.active {
      color: $brand-primary;
      border: 1px solid $brand-primary;
    }
  }
  .nested-tree {
    border-left: 1px dashed $base-border-color;
    margin-left: 10px;
    padding-left: 10px;
    min-width: 300px;
  }

  .fa-square-o {
      color: $input-border;
  }
  .fa-circle-thin,
  .fa-folder-open-o,
  .fa-home,
  .fa-list-ul {
    color: $brand-primary;
  }
}
</style>
