<template lang="html">
  <div class="item-form-buttons">
    <div :class="{'form-group':!itemIsEditable}">
      <button v-if="hasUserInput"
        type="button"
        class="btn btn-xs btn-list"
        @click.prevent="submit"
      >
      <i class="fa" :class="saveButtonIcon" aria-hidden="true"></i>
      Save
      </button>
      <button
        type="button"
        class="btn btn-xs btn-default"
        v-if="itemIsEditable||!itemIsEditable&&hasUserInput"
        @click="cancel"
      >Close</button>
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
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'item-form-buttons',
  props: {
    itemIsEditable: {
      type: Boolean,
      default: true
    },
    hasUserInput: {
      type: Boolean,
      default: true
    },
    isSaving: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      isDeletable: false
    }
  },
  computed: {
    ...mapGetters([
      'currentEditableItem'
    ]),
    deletabilityIcon: function() {
      return this.isDeletable ? 'fa-times' : 'fa-trash-o'
    },
    saveButtonIcon: function() {
      return this.isSaving ? 'fa-spinner fa-spin' : 'fa-floppy-o'
    }
  },
  methods: {
    ...mapActions([
      'deleteChecklistItem',
      'removeCurrentlyEditable'
    ]),
    submit: function() {
      this.$emit('submitForm')
    },
    cancel: function() {
      this.$emit('resetForm')
    },
    toggleDeletability: function() {
      return this.isDeletable = ! this.isDeletable
    },
    deleteItem: function() {
      this.deleteChecklistItem({item:this.currentEditableItem})
          .then(
            () => this.removeCurrentlyEditable()
          )
          .catch(
            () => { console.log('Error occured while deleting');}
          )
    },
  }
}
</script>
