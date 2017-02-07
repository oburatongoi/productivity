<template>
  <div>
      <show-item v-if="!modeIsEdit" :item="item"></show-item>
      <edit-item v-if="modeIsEdit" :item="item"></edit-item>
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
        'editableItems'
      ]),
      modeIsEdit: function() {
        return this.editableItems.indexOf(this.item) !== -1
      }
    },
    components: {
        ShowItem,
        EditItem
    }
}
</script>
