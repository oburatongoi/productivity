<template lang="html">
  <div class="item-form-buttons">
    <button
      type="button"
      class="btn btn-sm btn-folder"
      @click.prevent="saveAndClose"
    >
      <i class="fa" :class="saveButtonIcon" aria-hidden="true"/>
      Save &amp; Close
    </button>

    <div class="delete-item-btn-container">
      <i
        class="fa fa-fw toggle-delete-item-btn"
        :class="deletabilityIcon"
        aria-hidden="true"
        @click="toggleDeletability"
      />
      <i
        v-if="isDeletable"
        class="fa fa-fw fa-trash delete-item-btn"
        aria-hidden="true"
        @click="deleteItem"
      />

    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'manage-item-form-buttons',
  props: {
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
    deletabilityIcon: function() {
      return this.isDeletable ? 'fa-times' : 'fa-trash-o'
    },
    saveButtonIcon: function() {
      return this.isSaving ? 'fa-spinner fa-spin' : 'fa-floppy-o'
    }
  },
  methods: {
    ...mapActions([
      'deleteSelection'
    ]),
    submit: function() {
      this.$emit('saveChanges')
    },
    saveAndClose: function() {
      this.$emit('resetForm')
    },
    toggleDeletability: function() {
      return this.isDeletable = ! this.isDeletable
    },
    deleteItem: function() {
      this.deleteSelection()
    },
  }
}
</script>
