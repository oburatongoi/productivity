<template lang="html">
  <li
  class="nested-kanban-card checklist-item enlistable sectionable"
  :class="{
    opened: item.opened,
    selected: selected.checklistItems.indexOf(item) !== -1
  }"
  @click.stop="toggleSelection({ selection: {
    model: 'checklist-item',
    listing: item,
    parentModel: item.parent_id ? 'checklist-item' : 'checklist' },
    event: $event
  })"
  @dblclick.stop="toggleNestedKanban(item)" >

    <div class="nested-kanban-card-heading">

      <span class="checkbox-container">
        <span
        class="close-nested-kanban toggle-nested-kanban-btn"
        @click.stop="closeNestedKanbanChecklistItem(currentKanbanChecklistItem)"
        v-if="hasSubItemChain" >

          <i
          class="fa fa-fw fa-chevron-left"
          aria-hidden="true"/>

          <span>Back</span>
        </span>

        <i
        class="fa fa-fw"
        :class="checkboxClass"
        aria-hidden="true"
        @click="checkItem"
        v-if="listType=='ch'||listType=='ta'" />

        <i
        class="fa fa-fw fa-circle"
        aria-hidden="true"
        v-if="listType=='bu'" />

        <span
        class="ol-number"
        v-if="listType=='nu'" >
          {{ currentKanbanChecklistItem.sort_order + 1 }}.
        </span>

      </span>

      {{ currentKanbanChecklistItem.content | truncate(truncateLength) }}

      <span class="nested-kanban-card-buttons">

        <!-- <i
        class="fa fa-fw fa-ellipsis-h toggle-nested-kanban-btn"
        aria-hidden="true"
        @click.stop="toggleNestedKanbanMeta(currentKanbanChecklistItem)" /> -->

        <i
        class="fa fa-fw fa-eye toggle-nested-kanban-btn"
        aria-hidden="true"
        @click.stop="previewNestedKanban(currentKanbanChecklistItem)"
        title="Preview" />

        <i
        class="fa fa-fw fa-times toggle-nested-kanban-btn"
        aria-hidden="true"
        @click.stop="toggleNestedKanban(item)"
        v-if="!!item.opened&&!hasSubItemChain" />

      </span>

    </div>

    <item-form-meta
    :item="currentKanbanChecklistItem"
    :is-sub-item="!!currentKanbanChecklistItem.parent_id"
    :parent-model="currentKanbanChecklistItem.parent_id ? 'checklist-item' : 'checklist'"
    :in-kanban="true"
    v-if="currentKanbanChecklistItem.showMeta" />

    <template v-if="!!item.opened">

      <ul class="nested-kanban-card-body">

        <li v-if="currentKanbanChecklistItem.isLoading">
          <i
          class="fa fa-fw fa-circle-o-notch fa-spin loading-icon"
          aria-hidden="true" />
        </li>

        <li
        class="info-message"
        v-if="currentKanbanChecklistItem.infoMessage">
          {{ currentKanbanChecklistItem.infoMessage }}
        </li>

        <template
        v-if="currentKanbanChecklistItem.sub_items
        &&currentKanbanChecklistItem.sub_items.length">

          <kanban-sub-checklist-item
          v-for="sub_item in currentKanbanChecklistItem.sub_items"
          :key="sub_item.id"
          :item="sub_item"
          :ancestor="item" />

        </template>

      </ul>

      <div class="nested-kanban-card-footer">
        <add-item-lite :parent="currentKanbanChecklistItem" />
      </div>

    </template>

  </li>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import AddItemLite from '../AddItemLite.vue'
import ItemFormMeta from '../ItemFormMeta.vue'
import KanbanSubChecklistItem from './KanbanSubChecklistItem.vue'
export default {
  name: 'kanban-checklist-item',
  components: {
    AddItemLite,
    ItemFormMeta,
    KanbanSubChecklistItem,
  },
  props: {
    item: {
      type: Object,
      required: true
    },
    isExpanded: {
      type: Boolean,
      default: false
    },
    listType: {
      type: String,
      default: 'ch'
    },
  },
  data () {
    return {
      checkboxClassOverride: null,
    }
  },
  computed: {
    ...mapGetters([
      'selected'
    ]),
    checkboxClass: function() {
      return this.checkboxClassOverride ? this.checkboxClassOverride : this.item.checked_at ? 'fa-check' : this.isSubItem ? 'fa-square-o' : 'fa-circle-thin'
    },
    isSubItem: function() {
      return !! this.currentKanbanChecklistItem.parent_id
    },
    currentKanbanChecklistItem: function() {
      return this.hasSubItemChain ? this.item.subItemChain[this.item.subItemChain.length-1] : this.item
    },
    hasSubItemChain: function() {
      return this.item.subItemChain && this.item.subItemChain.length
    },
    truncateLength: function() {
      return this.isExpanded ? 80 : 45
    },
  },
  methods: {
    ...mapActions([
      'checkChecklistItem',
      'removeFromKanbanArray',
      'previewNestedKanban',
      'toggleNestedKanban',
      'toggleNestedKanbanMeta',
      'toggleSelection',
    ]),
    closeNestedKanbanChecklistItem: function(item) {
      this.removeFromKanbanArray({ array: this.item.subItemChain, value: item })
    },
    checkItem: function() {
      this.checkboxClassOverride = 'fa-circle-o-notch fa-spin'
      this.checkChecklistItem(this.item)
          .then( () => this.checkboxClassOverride = null )
          .catch( () => this.checkboxClassOverride = null )
    },
  }
}
</script>

<style lang="scss">
.nested-kanban-card.checklist-item {
  .checkbox-container {
    display: inline-block;
    // width: 30px;
    text-align: center;

    .fa {
        cursor: pointer;
    }

    .fa-ellipsis-h,
    .fa-square-o,
    .fa-circle-thin {
        color: $input-border;
    }

    .fa-circle-o-notch {
        color: $input-border;
    }

    .ol-number,
    .fa-check {
        color: $list-primary;
    }

    .ol-number {
        font-weight: bold;
        padding: 0 3px 0 5px;
    }

    .fa-circle {
        color: $list-primary;
        font-size: 0.7em;
    }
  }
  .nested-kanban-card-footer {
    padding: 0 10px 0 15px !important;
  }
}
</style>
