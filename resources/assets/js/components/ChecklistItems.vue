<template>
    <draggable class="checklist-items"
      :class="{'list-unstyled': listType!=='ol'}"
      :element="draggableListType"
      @end="beforeUpdateSortOrder"
      :list="items"
    >
      <template v-if="sections">

        <div
          class="section"
          v-for="section in sections"
          :key="section.id"
        >
          <h4 class="section-title">{{ section.title }}</h4>

          <checklist-item
            v-for="item in section.items"
            :item="item"
            :list-type="listType"
            :key="item.id"
            :parent-model="parentModel"
          />
        </div>
      </template>

      <template v-if="items">

        <h4 v-if="sections" class="section-title">Unsectioned Items</h4>

        <checklist-item
          v-for="item in items"
          :item="item"
          :list-type="listType"
          :key="item.id"
          :parent-model="parentModel"
        />
      </template>
    </draggable>
</template>

<script>
import { mapActions } from 'vuex'

import ChecklistItem from './ChecklistItem.vue'
import Draggable from 'vuedraggable'

export default {
    name: 'checklist-items',
    components: {
        ChecklistItem,
        Draggable
    },
    props: {
      items: {
        type: Array,
        required: true
      },
      // sections: {
      //   type: Array,
      //   default: () => []
      // },
      listType: {
        type: String,
        default: 'ch'
      },
      parent: {
        type: Object,
        required: true
      },
      parentModel: {
        type: String,
        required: true
      }
    },
    data () {
      return {
        sections: Productivity.sections || []
      }
    },
    computed: {
      draggableListType: function() {
        return this.checklist&&this.checklist.list_type&&this.checklist.list_type == 'nu' ? 'ol' : 'ul';
      }
    },
    created: function() {
      return this.sortChecklistItems({parentModel: this.parentModel, parent: this.parent})
    },
    methods: {
      ...mapActions([
        'sortChecklistItems',
        'updateSortOrder'
      ]),
      beforeUpdateSortOrder: function() {
        return this.updateSortOrder({checklistItems: this.items, parent: this.parent, parentModel: this.parentModel})
      },
    },
}
</script>

<style lang="scss">
  .checklist-items {
    padding: 0;
    .section-title {
      color: $brand-primary;
      font-weight: 300;
    }
    .section {
      margin-bottom: 20px;
    }
  }
</style>
