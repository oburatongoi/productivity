<template lang="html">
  <!-- <item-form :item="item" @submitForm="updateItem"></item-form> -->

  <form class="item-form-container edit-item-form" @submit.prevent="submitForm">
    <div class="item-form">
      <div class="item-form-content col-sm-12 col-md-8">
        <input type="text" v-model="localItem.content" placeholder="Add item..." maxlength="255">
      </div>
    </div>
  </form>
</template>

<script>
// import { mapActions, mapGetters } from 'vuex'
// import ItemForm from './ItemForm.vue'
export default {
  name: 'edit-item',
  data () {
    return {
      localItem: this.item
    }
  },
  props: ['item'],
  // computed: {
  //   ...mapGetters([
  //     'checklist'
  //   ])
  // },
  methods: {
    // ...mapActions([
    //   'updateChecklistItem'
    // ]),
    updateItem: function(item) {
      return this.updateChecklistItem({
          checklist_fake_id: this.checklist.fake_id,
          item: item,
          oldItem: this.item,
        })
    },
  },
  // components: {
  //     ItemForm
  // }
}
</script>
