<template lang="html">
  <div class="item-form-comments form-group">
    <div class="comments-label" @click="toggleComments">
      <i class="fa fa-chevron-down" :class="toggleCommentsIcon" aria-hidden="true"></i>
      <p>{{toggleCommentsButtonText}}</p>
    </div>

    <textarea  v-if="showComments"
      @change.keyup.blur.delete="saveChanges"
      class="form-control"
      v-model="currentEditableItem.comments"
      placeholder="Add a comment..."
      maxlength="25000"></textarea>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'item-form-comments',
  props: {
    showComments: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    ...mapGetters([
      'currentEditableItem'
    ]),
    hasComments: function() {
      return this.currentEditableItem.comments ? true : false
    },
    toggleCommentsIcon: function() {
      if (!this.showComments.comments &&! this.hasComments) return 'fa-chevron-down'
      if (!this.showComments.comments &&  this.hasComments) return 'fa-plus'
      if (this.showComments.comments &&  this.hasComments) return 'fa-chevron-up'
      if (this.showComments.comments &&! this.hasComments) return 'fa-times'
    },
    toggleCommentsButtonText: function() {
      if (!this.showComments.comments &&! this.hasComments) return 'Show Comments'
      if (!this.showComments.comments &&  this.hasComments) return 'Add Comments'
      if (this.showComments.comments &&  this.hasComments) return 'Hide Comments'
      if (this.showComments.comments &&! this.hasComments) return 'Cancel'
    }
  },
  methods: {
    toggleComments: function() {
      return this.showComments = ! this.showComments
    },
    saveChanges: function() {
      this.$emit('saveChanges')
    }
  },
}
</script>
