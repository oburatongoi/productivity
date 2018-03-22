<template lang="html">
  <div class="item-form-buttons">
    <div class="form-group" v-if="hasUserInput">
      <button type="button" class="btn btn-xs btn-list save-button" @click.prevent="submit">
        <i class="fa" :class="saveButtonIcon" aria-hidden="true"/>
        Save
      </button>

      <button type="button" class="btn btn-xs btn-default cancel-button" @click="cancel">
        Cancel
      </button>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'add-item-form-buttons',
  props: {
    hasUserInput: {
      type: Boolean,
      default: true
    },
    isSaving: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    saveButtonIcon: function() {
      return this.isSaving ? 'fa-spinner fa-spin' : 'fa-save'
    }
  },
  methods: {
    submit: function() {
      this.$emit('submitForm')
    },
    cancel: function() {
      this.$emit('resetForm')
    }
  }
}
</script>
