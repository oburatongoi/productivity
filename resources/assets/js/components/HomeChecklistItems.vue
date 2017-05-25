<template>
    <ul class="list-unstyled checklist-items">
        <checklist-item
          v-if="items"
          v-for="item in items"
          :item="item"
        ></checklist-item>
    </ul>
</template>

<script>
import { mapGetters } from 'vuex'

import ChecklistItem from './ChecklistItem.vue'

export default {
    name: 'home-checklist-items',
    computed: {
      ...mapGetters({
        items: 'pendingItems'
      })
    },
    components: {
        ChecklistItem
    },
}
</script>
