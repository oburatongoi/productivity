<template lang="html">
  <!-- <li
    class="nested-kanban-card sub-checklist-item enlistable sub-enlistable sectionable"
    :class="{ selected: selected.checklistItems.indexOf(item) !== -1 }"
    @click.stop="toggleSelection({selection: { model: 'checklist-item', listing: item, parentModel: 'checklist-item' }, event: $event})"
    @dblclick.stop="openNestedKanbanChecklistItem(item)" > -->
  <li
    class="nested-kanban-card sub-checklist-item enlistable sub-enlistable sectionable"
    @click.stop="openNestedKanbanChecklistItem(item)"
    @dblclick.stop="openNestedKanbanChecklistItem(item)" >

    <div class="nested-kanban-card-heading">

      <span class="checkbox-container">

        <i
        class="far fa-fw"
        :class="checkboxClass"
        aria-hidden="true"
        @click.stop="checkItem"
        v-if="listType=='ch'||listType=='ta'" />

        <i
        class="fas fa-fw fa-circle"
        aria-hidden="true"
        v-if="listType=='bu'" />

        <span
        class="ol-number"
        aria-hidden="true"
        v-if="listType=='nu'">
          {{ item.sort_order + 1 }}.
        </span>

      </span>

      {{ item.content | truncate(35) }}

      <i
      class="fas fa-fw toggle-button"
      :class="toggleIconClass"
      aria-hidden="true"
      @click.stop="openNestedKanbanChecklistItem(item)" />

      <span class="nested-kanban-card-icons">

        <!-- <i
        class="far fa-fw fa-ellipsis-h nested-kanban-card-icon"
        aria-hidden="true"
        @click.stop="toggleNestedKanbanMeta(item)" /> -->

        <i
        class="far fa-fw fa-arrow-to-right nested-kanban-card-icon"
        aria-hidden="true"
        @click.stop="previewNestedKanban(item)"
        title="Preview" />

      </span>

    </div>

    <item-form-meta
    :item="item"
    :is-sub-item="!!item.parent_id"
    :parent-model="item.parent_id ? 'checklist-item' : 'checklist'"
    :in-kanban="true"
    v-if="item.showMeta" />

  </li>

</template>

<script>
// import { mapActions, mapGetters } from 'vuex'
import { mapActions } from 'vuex'
import ItemFormMeta from '../ItemFormMeta.vue'
export default {
  name: 'kanban-sub-checklist-item',
  components: {
    ItemFormMeta,
  },
  props: {
    item: {
      type: Object,
      required: true
    },
    listType: {
      type: String,
      default: 'ch'
    },
    ancestor: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      checkboxClassOverride: null,
    }
  },
  computed: {
    // ...mapGetters([
    //   'selected'
    // ]),
    checkboxClass: function() {
      return this.checkboxClassOverride ? this.checkboxClassOverride : this.item.checked_at ? 'fa-check' : 'fa-square'
    },
    toggleIconClass: function() {
      return this.item.opened ? 'fa-caret-up' : 'fa-caret-down';
    },
  },
  methods: {
    ...mapActions([
      'addToKanbanArray',
      'fetchNestedKanbanDescendants',
      'checkChecklistItem',
      'previewNestedKanban',
      // 'toggleNestedKanban',
      // 'toggleNestedKanbanMeta',
      // 'toggleSelection',
    ]),
    checkItem: function() {
      this.checkboxClassOverride = 'fa-circle-notch fa-spin'
      this.checkChecklistItem(this.item)
          .then( () => this.checkboxClassOverride = null )
          .catch( () => this.checkboxClassOverride = null )
    },
    openNestedKanbanChecklistItem: function(item) {
      if (!this.ancestor.subItemChain) this.$set(this.ancestor, 'subItemChain', [])
      this.addToKanbanArray({ array: this.ancestor.subItemChain, value: item })
          .then( () => this.fetchNestedKanbanDescendants(item) )
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

    .fa-square,
    .fa-circle {
        color: $input-border;
        // font-size: 1.5em;
    }

    .fa-circle-notch {
        color: $input-border;
        // font-size: 1em;
    }

    .ol-number,
    .fa-check {
        color: $list-primary;
        // font-size: 1em;
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
}
</style>
