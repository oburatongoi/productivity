<template lang="html">
  <!-- <li
  class="nested-kanban-card checklist enfoldable"
  :class="{ opened: checklist.opened, selected: selected.checklists.indexOf(checklist) !== -1 }"
  @click.stop="toggleSelection({selection: { model: 'checklist', listing: checklist, parentModel: checklist.parent_id ? 'checklist' : 'folder' }, event: $event})"
  @dblclick.stop="toggleNestedKanban(checklist)" > -->
  <li
  class="nested-kanban-card checklist enfoldable"
  :class="{ opened: checklist.opened }"
  @click.stop="toggleNestedKanban(checklist)"
  @dblclick.stop="toggleNestedKanban(checklist)" >

    <div class="nested-kanban-card-heading">

      <i
      class="fa fa-fw"
      :class="checklistIconClass"
      aria-hidden="true" />

      {{ checklist.title | truncate(35) }}

      <span class="nested-kanban-card-buttons">

        <i
        class="fa fa-fw fa-link toggle-nested-kanban-btn"
        aria-hidden="true"
        @click.stop="navigateToNestedKanban(checklist)"
        :id="'#nested-checklist-'+checklist.fake_id"
        v-tooltip.bottom="{
          content: 'Open Link',
          classes: 'checklist',
          trigger: 'hover',
          autoHide: false,
          container: '#nested-checklist-'+checklist.fake_id
        }" />

        <i
        class="fa fa-fw fa-times toggle-nested-kanban-btn"
        aria-hidden="true"
        @click.stop="toggleNestedKanban(checklist)"
        v-if="!!checklist.opened" />

      </span>

    </div>

    <ul
    v-if="!!checklist.opened"
    class="nested-kanban-card-body" >

      <i
      class="fa fa-fw fa-circle-o-notch fa-spin loading-icon"
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
        :parent="checklist" />

        <kanban-section
        :section="defaultSection"
        :parent="checklist"
        v-if="defaultSection" />

      </template>

      <template v-if="checklist.items&&!checklist.sections">

        <kanban-checklist-item
        v-for="item in checklist.items"
        :key="'item'+item.id"
        :item="item"
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
    }
  },
  computed: {
    // ...mapGetters([
    //   'selected'
    // ]),
    checklistIconClass: function() {
    return ! this.checklist.list_type         ? 'fa-list'         :
             this.checklist.list_type == 'ch' ? 'fa-list'         :
             this.checklist.list_type == 'ta' ? 'fa-check-square' :
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
