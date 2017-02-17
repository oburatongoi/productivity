<template lang="html">
  <item-form :item="item" @submitForm="addItem"></item-form>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import ItemForm from './ItemForm.vue'
export default {
  name: 'add-item',
  data () {
    return {
      item: {
        content: undefined,
        is_urgent: undefined,
        is_important: undefined,
        deadline: undefined,
        addable: true,
      }
    }
  },
  computed: {
    ...mapGetters([
      'checklist'
    ])
  },
  methods: {
    showError: function() {
      alert('error adding item')
    },
    addItem: function(item) {
      return this.addChecklistItem({
          checklist_fake_id: this.checklist.fake_id,
          item: item
        })
    },
    ...mapActions([
      'addChecklistItem'
    ])
  },
  components: {
      ItemForm
  }
}
</script>
