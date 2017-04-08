<template lang="html">
  <div class="edit-comments">
    <div class="comments-label">
      <i class="fa fa-note" aria-hidden="true"></i>
      Notes
    </div>

    <textarea
      @change="debounceSaveChanges"
      @keyup="debounceSaveChanges"
      @keydown="debounceSaveChanges"
      @delete="debounceSaveChanges"
      class="comments-textarea"
      v-model="currentEditableItem.comments"
      placeholder="Add a comment..."
      maxlength="25000"></textarea>

  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'manage-item-form-comments',
  computed: {
    ...mapGetters([
      'currentEditableItem'
    ])
  },
  methods: {
    debounceSaveChanges: _.debounce(function() {
      this.saveChanges()
    }, 500),
    saveChanges: function() {
      this.$emit('saveChanges')
    }
  }
}
</script>
