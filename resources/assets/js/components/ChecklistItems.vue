<template>
    <ul class="list-unstyled checklist-items">
        <checklist-item
          v-if="checklist.items"
          v-for="item in checklist.items"
          :item="item"
          :type="checklist.list_type"
          :key="item.id"
        ></checklist-item>
    </ul>
</template>

<script>
import { mapGetters } from 'vuex'

import ChecklistItem from './ChecklistItem.vue'

export default {
    name: 'checklist-items',
    computed: {
      ...mapGetters([
        'checklist'
      ])
    },
    components: {
        ChecklistItem
    },
}
</script>
