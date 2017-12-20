<template>
  <div class="index-tasks" :class="taskClass">
    <div class="panel main-panel">
      <div class="home-body panel-body">
        <ul class="list-unstyled checklist-items">
            <checklist-item
              v-if="checklistItems.length"
              v-for="item in checklistItems"
              :item="item"
              type="ta"
              :key="item.id"
              :parent-model="'checklist'"
              @onEmitClick="toggleSelection"
            ></checklist-item>

            <li v-if="!checklistItems.length">There are no pending tasks at this time.</li>
        </ul>
      </div>
    </div>

    <div class="panel side-panel checklist-item-tree" v-if="editableSubItem.id">
      <div class="panel-body">
        <ul>
          <li>
            <i class="fa fa-fw fa-home" aria-hidden="true"></i>
            Home
          </li>
          <li>
            <ul class="left-border">
              <li>
                <i class="fa fa-fw fa-check" aria-hidden="true" v-if="editableItem.checked_at"></i>
                <i class="fa fa-fw fa-circle-thin" aria-hidden="true" v-if="!editableItem.checked_at"></i>
                {{editableItem.content}}
              </li>
              <li>
                <ul class="left-border">
                  <li v-for="item in editableItem.child_list_items" :key="item.id">
                    <i class="fa fa-fw fa-check" aria-hidden="true" v-if="item.checked_at"></i>
                    <i class="fa fa-fw fa-square-o" aria-hidden="true" v-if="!item.checked_at"></i>
                    {{item.content}}
                  </li>
                </ul>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>

    <edit-checklist-item
      v-if="editableItem.id"
      :list-type="'ta'"
      :item="editableItem"
      parent-model="checklist"
    ></edit-checklist-item>

    <edit-checklist-item
      v-if="editableSubItem.id"
      :list-type="'ta'"
      :item="editableSubItem"
      parent-model="checklist-item"
    ></edit-checklist-item>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

import ChecklistItem from './ChecklistItem.vue'
import EditChecklistItem from './EditChecklistItem.vue'

export default {
    name: 'index-tasks',
    methods: {
      ...mapActions([
        'toggleSelection'
      ])
    },
    computed: {
      ...mapGetters([
        'checklistItems',
        'editableItem',
        'editableSubItem',
        'editableItemIsExpanded',
        'editableSubItemIsExpanded'
      ]),
      taskClass: function() {
        // if (this.editableItem.id && this.editableItemIsExpanded) return 'has-expanded-editable-item'
        // if (this.editableItem.id && ! this.editableItemIsExpanded) return 'has-editable-item'
        // return null
        return  this.editableSubItemIsExpanded ? 'has-expanded-editable-sub-item':
                this.editableSubItem.id        ? 'has-editable-sub-item'         :
                this.editableItemIsExpanded    ? 'has-expanded-editable-item'    :
                this.editableItem.id           ? 'has-editable-item'             :
                                                  null                           ;
      }
    },
    components: {
        ChecklistItem,
        EditChecklistItem
    },
}
</script>

<style lang="scss">
.checklist-item-tree {
  font-size: 1.1em;
  ul {
    list-style: none;
    padding-left: 20px;
    margin-top: 0;
  }
  .left-border {
    border-left: 1px dashed $base-border-color;
    margin-left: 10px;
  }
  .fa-circle-thin,
  .fa-square-o {
      color: $input-border;
  }
  .fa-list-ul {
    color: $list-primary;
  }
}
</style>
