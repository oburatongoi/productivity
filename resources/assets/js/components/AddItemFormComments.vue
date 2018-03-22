<template lang="html">
  <div class="add-item-form-comments form-group">
    <template v-if="!showComments">
      <div class="comments-label" v-if="hasComments" @click="toggleComments">
        <i class="far fa-chevron-down" aria-hidden="true"/>
        <p>Preview Comments</p>
      </div>
      <div class="comments-label" v-if="!hasComments" @click="toggleComments">
        <i class="far fa-plus" aria-hidden="true"/>
        <p>Quick Add Comments</p>
      </div>
    </template>

    <template v-if="showComments">
      <div class="comments-label" v-if="hasComments" @click="toggleComments">
        <i class="far fa-chevron-up" aria-hidden="true"/>
        <p>Hide Comments</p>
      </div>
      <div class="comments-label" v-if="!hasComments" @click="toggleComments">
        <i class="far fa-times" aria-hidden="true"/>
        <p>Cancel</p>
      </div>
      <!-- <textarea v-on="{ change: saveChanges, keyup: saveChanges, blur: saveChanges, delete: saveChanges }"
                class="form-control"
                v-model="item.comments"
                placeholder="Add a comment..."
                maxlength="25000"/> -->
      <textarea
        @change="saveChanges"
        @keyup="saveChanges"
        @blur="saveChanges"
        @delete="saveChanges"
        class="form-control"
        v-model="item.comments"
        placeholder="Add a comment..."
        maxlength="25000"
      />
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

<style lang="scss">
.add-item-form-comments {
    .comments-label {
        display: block;
        margin: 10px 0 0;
        cursor: pointer;
        color: $text-color;
        font-size: 0.7em;
        p {
            margin: 0 3px;
            font-family: $font-family-sans-serif;
            font-weight: $font-weight-bold;
            display: inline-block;
        }
    }
}
</style>
