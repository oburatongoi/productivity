<template lang="html">
  <item-form :item="item" @submitForm="updateItem" @resetForm="refreshItem"></item-form>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import ItemForm from './ItemForm.vue'
export default {
  name: 'edit-item',
  props: ['item'],
  computed: {
    ...mapGetters([
      'checklist'
    ])
  },
  methods: {
    ...mapActions([
      'updateChecklistItem',
      'setEditability'
    ]),
    updateItem: function() {
      return this.updateChecklistItem({
          checklist_fake_id: this.checklist.fake_id,
          item: this.item
        })
    },
    refreshItem: function() {
      this.setEditability({editable: false, item:this.item })
    }
  },
  components: {
      ItemForm
  }
}
</script>
