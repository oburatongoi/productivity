<template lang="html">
  <div class="add-item-form-comments form-group">
    <template v-if="!showComments">
      <div class="comments-label" v-if="hasComments" @click="toggleComments">
        <i class="fa fa-chevron-down" aria-hidden="true"></i>
        <p>Preview Comments</p>
      </div>
      <div class="comments-label" v-if="!hasComments" @click="toggleComments">
        <i class="fa fa-plus" aria-hidden="true"></i>
        <p>Quick Add Comments</p>
      </div>
    </template>

    <template v-if="showComments">
      <div class="comments-label" v-if="hasComments" @click="toggleComments">
        <i class="fa fa-chevron-up" aria-hidden="true"></i>
        <p>Hide Comments</p>
      </div>
      <div class="comments-label" v-if="!hasComments" @click="toggleComments">
        <i class="fa fa-times" aria-hidden="true"></i>
        <p>Cancel</p>
      </div>
      <textarea @change.keyup.blur.delete="saveChanges"
                class="form-control"
                v-model="item.comments"
                placeholder="Add a comment..."
                maxlength="25000">
      </textarea>
    </template>
  </div>
</template>

<script>
export default {
  name: 'item-form-comments',
  props: {
    item: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      showComments: false
    }
  },
  computed: {
    hasComments: function() {
      return this.item.comments ? true : false
    },
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
