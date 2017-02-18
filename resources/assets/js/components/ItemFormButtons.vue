<template lang="html">
  <div class="item-form-buttons">
    <div :class="{'form-group':!itemIsEditable}">
      <button
        type="button"
        class="btn btn-xs btn-list"
        v-if="hasUserInput"
        @click.prevent="submit"
      >Save</button>
      <button
        type="button"
        class="btn btn-xs btn-default"
        v-if="itemIsEditable||!itemIsEditable&&hasUserInput"
        @click="cancel"
      >Cancel</button>
    </div>

    <div class="delete-item-btn-container" v-if="itemIsEditable">
      <i
        class="fa toggle-delete-item-btn"
        :class="deletabilityIcon"
        aria-hidden="true"
        @click="toggleDeletability"
      ></i>
      <i
        class="fa fa-trash-o delete-item-btn"
        aria-hidden="true"
        v-if="isDeletable"
        @click="deleteItem"
      ></i>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'item-form-buttons',
  props: {
    item: Object,
    itemIsEditable: Boolean,
    hasUserInput: Boolean
  },
  data () {
    return {
      isDeletable: false
    }
  },
  computed: {
    deletabilityIcon: function() {
      return this.isDeletable ? 'fa-times' : 'fa-trash-o'
    }
  },
  methods: {
    ...mapActions([
      'setEditability',
      'deleteChecklistItem'
    ]),
    submit: function() {
      this.$emit('submitForm')
    },
    cancel: function() {
      this.itemIsEditable ? this.setEditability({editable: false, id:this.item.id }) : this.$emit('resetForm')
    },
    toggleDeletability: function() {
      return this.isDeletable = ! this.isDeletable
    },
    deleteItem: function() {
      this.deleteChecklistItem({item:this.item})
    },
  }
}
</script>
