<template lang="html">
  <!-- <li
  class="nested-kanban-card checklist-item enlistable sectionable"
  :class="{ opened: item.opened, selected: selected.checklistItems.indexOf(item) !== -1 }"
  @click.stop="toggleSelection({ selection: {
    model: 'checklist-item',
    listing: item,
    parentModel: item.parent_id ? 'checklist-item' : 'checklist' },
    event: $event
  })"
  @dblclick.stop="toggleNestedKanban(item)" > -->
  <li
  class="nested-kanban-card checklist-item enlistable sectionable"
  :class="{ opened: item.opened, selected: selected.checklistItems.indexOf(item) !== -1 }" >

    <div
    class="nested-kanban-card-heading"
    @click.stop="toggleSelection({ selection: {
      model: 'checklist-item',
      listing: item,
      parentModel: item.parent_id ? 'checklist-item' : 'checklist' },
      event: $event
    })"
    @dblclick.stop="beforeToggleNestedKanban(item)" >

      <span class="checkbox-container">
        <span
        class="close-nested-kanban"
        @click.stop="closeNestedKanbanChecklistItem(currentKanbanChecklistItem)"
        v-if="hasSubItemChain" >

          <i
          class="far fa-fw fa-chevron-left"
          aria-hidden="true"/>

          <span>Back</span>
        </span>

        <i
        class="fal fa-fw"
        :class="checkboxClass"
        aria-hidden="true"
        @click="checkItem"
        v-if="listType=='ch'||listType=='ta'||!listType" />

        <i
        class="fas fa-fw fa-circle"
        aria-hidden="true"
        v-if="listType=='bu'" />

        <span
        class="ol-number"
        v-if="listType=='nu'" >
          {{ currentKanbanChecklistItem.sort_order + 1 }}.
        </span>

      </span>

      {{ currentKanbanChecklistItem.content | truncate(truncateLength) }}

      <i
      class="fas fa-fw nested-kanban-card-icon"
      :class="toggleIconClass"
      aria-hidden="true"
      @click.stop="toggleNestedKanban(item)"
      v-if="!hasSubItemChain" />

      <span class="nested-kanban-card-icons">

        <!-- <i
        class="far fa-fw fa-ellipsis-h nested-kanban-card-icon"
        aria-hidden="true"
        @click.stop="toggleNestedKanbanMeta(currentKanbanChecklistItem)" /> -->

        <i
        class="far fa-fw fa-arrow-to-right nested-kanban-card-icon"
        aria-hidden="true"
        @click.stop="previewNestedKanban(currentKanbanChecklistItem)"
        :title="'Preview ' + currentKanbanChecklistItem.content" />

        <i
        class="far fa-fw fa-times nested-kanban-card-icon"
        aria-hidden="true"
        @click.stop="closeAllNestedKanbanChecklistItems(item)"
        v-if="item.opened&&hasSubItemChain" />

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
          class="fal fa-fw fa-circle-notch fa-spin loading-icon"
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
          :truncate-length="truncateLength"
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
// import { mapActions } from 'vuex'
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
    truncateLength: {
      type: Number,
      default: 45
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
      return this.checkboxClassOverride ? this.checkboxClassOverride : this.item.checked_at ? 'fa-check' : this.isSubItem ? 'fa-square' : 'fa-circle'
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
    toggleIconClass: function() {
      return this.item.opened ? 'fa-caret-up' : 'fa-caret-down';
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
    beforeToggleNestedKanban: function(item) {
      if (! this.hasSubItemChain) this.toggleNestedKanban(item)
    },
    closeNestedKanbanChecklistItem: function(item) {
      this.removeFromKanbanArray({ array: this.item.subItemChain, value: item })
    },
    closeAllNestedKanbanChecklistItems: function(item) {
      this.removeFromKanbanArray({ array: this.item.subItemChain, removeAll: true })
      this.toggleNestedKanban(item)
    },
    checkItem: function() {
      this.checkboxClassOverride = 'fa-circle-notch fa-spin'
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

    .far, .fas, .fal {
        cursor: pointer;
    }

    .fa-ellipsis-h,
    .fa-square,
    .fa-circle {
        color: $input-border;
    }

    .fa-circle-notch {
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

    .fa-circle.fas {
        color: $list-primary;
        font-size: 0.7em;
    }
  }
  .nested-kanban-card-footer {
    padding: 0 10px 0 15px !important;
  }
}
</style>
