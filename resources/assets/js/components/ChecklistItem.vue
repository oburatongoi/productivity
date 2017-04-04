<template>
  <div v-if="itemIsVisible&&!itemIsDeleted">
      <show-item :item="item"></show-item>
  </div>
</template>

<script>

import { mapActions, mapGetters } from 'vuex'

import ShowItem from './ShowItem.vue'

export default {
    name: 'checklist-item',
    props: ['item'],
    computed: {
      ...mapGetters([
        'editableItems',
        'deletedItems',
        'filters'
      ]),
      itemIsDeleted: function() {
        return this.deletedItems.indexOf(this.item.id) !== -1
      },
      itemPassesCheckedFilter: function() {
        if (this.filters.checked == 'all') {
          return true
        }
        if (this.filters.checked == 'checked') {
          if (this.item.checked_at && this.item.checked_at !== null) {
            return true
          }
          return false
        }
        if (this.filters.checked == 'unchecked') {
          if (!this.item.checked_at || this.item.checked_at == null) {
            return true
          }
          return false
        }
        return true
      },
      itemPassesPriorityFilter: function() {
        if (this.filters.priority == 'none') {
          return true
        }
        if (this.filters.priority == 'both') {
          if (this.item.is_important && this.item.is_urgent) {
            return true
          }
          return false
        }
        if (this.filters.priority == 'important') {
          if (this.item.is_important && ! this.item.is_urgent) {
            return true
          }
          return false
        }
        if (this.filters.priority == 'urgent') {
          if (this.item.is_urgent && ! this.item.is_important) {
            return true
          }
          return false
        }
        return true
      },
      itemIsVisible: function() {
        return this.itemPassesCheckedFilter && this.itemPassesPriorityFilter
      }
    },
    components: {
        ShowItem
    }
}
</script>
