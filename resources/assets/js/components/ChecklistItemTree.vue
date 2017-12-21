<template lang="html">
  <div class="panel side-panel checklist-item-tree">
    <div class="panel-body">
      <ul>
        <li
        class="item"
        @click="emitClick({ selection: {model: 'home'}, event: $event})"
        >
          <i class="fa fa-fw fa-home" aria-hidden="true"></i>
          Home
        </li>

        <li v-if="folder"><ul class="nested-tree">
          <checklist-item-tree-folder
            v-if="folder"
            :folder="folder"
            @onClick="emitClick"
          ></checklist-item-tree-folder>

          <!-- Nested Checklist -->
          <li><ul class="nested-tree">
              <checklist-item-tree-checklist
                v-if="checklist"
                :checklist="checklist"
                @onClick="emitClick"
              ></checklist-item-tree-checklist>
              <!-- Nested ChecklistItem -->
              <li>
                <checklist-item-tree-item
                  :item="item"
                  @onClick="emitClick"
                ></checklist-item-tree-item>
              </li>
              <!-- End Nested ChecklistItem -->
          </ul></li>
          <!-- End Nested Checklist -->

        </ul></li>

        <li v-if="!folder"><ul class="nested-tree">
          <checklist-item-tree-checklist
            v-if="checklist"
            :checklist="checklist"
            @onClick="emitClick"
          ></checklist-item-tree-checklist>
          <!-- Nested ChecklistItem -->
          <li>
            <checklist-item-tree-item
              :item="item"
              @onClick="emitClick"
            ></checklist-item-tree-item>
          </li>
          <!-- End Nested ChecklistItem -->
        </ul></li>






        <!-- <li>
          <ul class="nested-tree">
            <li
            class="item"
            @click="emitClick({selection: {model: 'checklist-item', listing: item, parentModel: 'checklist'}, event: $event})"
            >
              <i class="fa fa-fw fa-check" aria-hidden="true" v-if="item.checked_at"></i>
              <i class="fa fa-fw fa-circle-thin" aria-hidden="true" v-if="!item.checked_at"></i>
              {{item.content}}
            </li>
            <li>
              <ul class="nested-tree">
                <li
                v-for="subItem in item.child_list_items"
                class="item"
                :class="{selected: subItem.id==editableSubItem.id}"
                @click="emitClick({selection: {model: 'checklist-item', listing: subItem, parentModel: 'checklist-item'}, event: $event})"
                :key="subItem.id"
                >
                  <i class="fa fa-fw fa-check" aria-hidden="true" v-if="subItem.checked_at"></i>
                  <i class="fa fa-fw fa-square-o" aria-hidden="true" v-if="!subItem.checked_at"></i>
                  {{subItem.content}}
                </li>
              </ul>
            </li>
          </ul>
        </li> -->
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
  props: {
    folder: undefined,
    checklist: undefined,
    item: {
      type: Object,
      required: true
    },
    parentComponent: {
      type: String,
      required: true
    }
  },
  methods: {
    emitClick: function(payload) {
      if (payload.selection.model == 'checklist' && this.parentComponent == 'index-tasks') {
        return window.location.href = '/lists/'+payload.selection.listing.fake_id
      }
      if (payload.selection.model == 'folder') {
        return window.location.href = '/folders/'+payload.selection.listing.fake_id
      }
      this.$emit('onSelection', payload)
    }
  },
  components: {
    ChecklistItemTreeFolder,
    ChecklistItemTreeChecklist,
    ChecklistItemTreeItem
  }
}
</script>

<style lang="scss">
.checklist-item-tree {
  font-size: 1.1em;
  .panel-body {
    height: 100%;
    overflow-y: scroll;
  }

  ul {
    list-style: none;
    padding-left: 20px;
    margin-top: 0;
  }
  li.item {
    cursor: pointer;
    &:hover {
      background: $body-bg;
    }
    &.selected {
      border: 1px dashed $base-border-color;
      border-radius: 2px;
      background: $body-bg;
    }
  }
  .nested-tree {
    border-left: 1px dashed $base-border-color;
    margin-left: 10px;
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
