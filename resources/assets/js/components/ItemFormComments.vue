<template lang="html">
  <div class="form-group">
    <template v-if="!showComments">
      <div class="comments-label" v-if="hasComments" @click="toggleComments">
        <i class="fa fa-chevron-down" aria-hidden="true"></i>
        <p>Show Comments</p>
      </div>
      <div class="comments-label" v-if="!hasComments" @click="toggleComments">
        <i class="fa fa-plus" aria-hidden="true"></i>
        <p>Add Comments</p>
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
      <textarea  class="form-control" v-model="item.comments" rows="2" placeholder="Add a comment..." maxlength="25000"></textarea>
    </template>
  </div>
</template>

<script>
export default {
  name: 'item-form-comments',
  props: {
    item: Object
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

  },
}
</script>
