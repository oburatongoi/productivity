<template lang="html">
  <!-- <li
  class="nested-kanban-card checklist enfoldable"
  :class="{ opened: checklist.opened, selected: selected.checklists.indexOf(checklist) !== -1 }"
  @click.stop="toggleSelection({selection: { model: 'checklist', listing: checklist, parentModel: checklist.parent_id ? 'checklist' : 'folder' }, event: $event})"
  @dblclick.stop="toggleNestedKanban(checklist)" > -->
  <li
  class="nested-kanban-card checklist enfoldable"
  :class="{ opened: checklist.opened }" >

    <div
    class="nested-kanban-card-heading"
    @click.stop="toggleNestedKanban(checklist)"
    @dblclick.stop="toggleNestedKanban(checklist)" >

      <i
      class="far fa-fw"
      :class="checklistIconClass"
      aria-hidden="true" />

      {{ checklist.title | truncate(truncateLength) }}

      <i
      class="fas fa-fw toggle-button"
      :class="toggleIconClass"
      aria-hidden="true"
      @click.stop="toggleNestedKanban(checklist)"
      :id="'#nested-checklist-'+checklist.fake_id" />

      <span class="nested-kanban-card-icons">

        <i
        class="far fa-fw fa-arrow-circle-right nested-kanban-card-icon"
        aria-hidden="true"
        @click.stop="navigateToNestedKanban(checklist)"
        :id="'#nested-checklist-'+checklist.fake_id"
        :title="'Navigate to '+ checklist.title" />

        <i
        class="far fa-fw fa-times nested-kanban-card-icon"
        aria-hidden="true"
        @click.stop="toggleNestedKanban(checklist)"
        v-if="!!checklist.opened" />

      </span>

    </div>

    <ul
    v-if="!!checklist.opened"
    class="nested-kanban-card-body" >

      <i
      class="fal fa-fw fa-circle-notch fa-spin loading-icon"
      aria-hidden="true"
      v-if="checklist.isLoading" />

      <p
      class="info-message"
      v-if="checklist.infoMessage">
        {{ checklist.infoMessage }}
      </p>

      <template v-if="checklist.sections&&checklist.sections.length">

        <kanban-section
        v-for="section in checklist.sections"
        :key="section.id"
        :section="section"
        :truncate-length="truncateLength"
        :parent="checklist" />

        <kanban-section
        :section="defaultSection"
        :parent="checklist"
        :truncate-length="truncateLength"
        v-if="defaultSection" />

      </template>

      <template v-if="checklist.items&&!checklist.sections">

        <kanban-checklist-item
        v-for="item in checklist.items"
        :key="'item'+item.id"
        :item="item"
        :truncate-length="truncateLength"
        :list-type="checklist.list_type" />

        <add-item-lite :parent="checklist" />

        <add-section :parent="checklist" />

      </template>

      <template v-if="!checklist.items&&!checklist.sections">

        <add-item-lite :parent="checklist" />

        <add-section :parent="checklist" />

      </template>

    </ul>

  </li>

</template>

<script>
// import { mapActions, mapGetters } from 'vuex'
import { mapActions } from 'vuex'
import AddItemLite from '../AddItemLite.vue'
import AddSection from '../AddSection.vue'
import KanbanChecklistItem from './KanbanChecklistItem.vue'
import KanbanSection from './KanbanSection.vue'
export default {
  name: 'kanban-checklist',
  components: {
    AddItemLite,
    AddSection,
    KanbanChecklistItem,
    KanbanSection
  },
  props: {
    checklist: {
      type: Object,
      required: true
    },
    truncateLength: {
      type: Number,
      default: 45
    },
  },
  computed: {
    // ...mapGetters([
    //   'selected'
    // ]),
    checklistIconClass: function() {
    return ! this.checklist.list_type         ? 'fa-list'         :
             this.checklist.list_type == 'ch' ? 'fa-list'         :
             this.checklist.list_type == 'ta' ? 'fa-tasks' :
             this.checklist.list_type == 'bu' ? 'fa-list-ul'      :
             this.checklist.list_type == 'nu' ? 'fa-list-ol'      :
                                                'fa-list'         ;
    },
    defaultSection: function() {
      if (this.checklist.items && this.checklist.items.length) {
        return {
          title: 'Unsectioned Items',
          items: this.checklist.items,
          model: this.checklist.model,
          id: this.checklist.id,
          list_type: this.checklist.list_type
        }
      }
      return null
    },
    toggleIconClass: function() {
      return this.checklist.opened ? 'fa-caret-up' : 'fa-caret-down';
    },
  },
  methods: {
    ...mapActions([
      'navigateToNestedKanban',
      'toggleNestedKanban',
      // 'toggleSelection',
    ]),
  }
}
</script>

<style lang="scss">

</style>
