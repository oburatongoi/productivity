<template>
  <div v-if="!itemIsDeleted">
      <show-item v-if="!itemIsEditable" :item="item"></show-item>
      <edit-item v-if="itemIsEditable" :item="item"></edit-item>
  </div>
</template>

<script>

import { mapActions, mapGetters } from 'vuex'

import ShowItem from './ShowItem.vue'
import EditItem from './EditItem.vue'

export default {
    name: 'checklist-item',
    props: ['item'],
    computed: {
      ...mapGetters([
        'editableItems',
        'deletedItems'
      ]),
      itemIsEditable: function() {
        return this.editableItems.indexOf(this.item.id) !== -1
      },
      itemIsDeleted: function() {
        return this.deletedItems.indexOf(this.item.id) !== -1
      },
    },
    components: {
        ShowItem,
        EditItem
    }
}
</script>
