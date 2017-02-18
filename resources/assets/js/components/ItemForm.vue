<template lang="html">
  <form class="item-form-container" :class="{ 'edit-item-form': itemIsEditable }" @submit.prevent="submitForm">
    <div class="item-form">
      <div class="item-form-content col-sm-12 col-md-9">
        <input type="text" v-model="localItem.content" placeholder="Add item...">
      </div>

      <div class="item-form-meta" v-if="itemIsEditable||hasContent">
        <span class="item-form-bool">
          <label for="is-important">Important</label>
          <input type="checkbox" id="is-important" v-model="localItem.is_important">
        </span>

        <span class="item-form-bool">
          <label for="is-urgent">Urgent</label>
          <input type="checkbox" id="is-urgent" v-model="localItem.is_urgent">
        </span>

        <span class="item-form-date">
          <label for="deadline">Deadline</label>
          <p @click="showDatePicker">
            <i class="fa fa-fw fa-calendar" aria-hidden="true"></i>
            {{deadlinePlaceholder}}
          </p>
          <i class="fa fa-fw fa-times delete-checklist-item" aria-hidden="true" v-if="this.localItem.deadline" @click="removeDeadline"></i>
        </span>
      </div>
    </div>

    <div class="datepicker-container" v-if="chooseDate">
      <datepicker value="item.deadline" @selected="setDate" :inline="true"></datepicker>
    </div>

    <div class="form-group" v-if="hasUserInput">
      <div class="comments-label" v-if="!showComments&&hasComments" @click="toggleComments">
        <i class="fa fa-chevron-down" aria-hidden="true"></i>
        <p>Show Comments</p>
      </div>
      <div class="comments-label" v-if="!showComments&&!hasComments" @click="toggleComments">
        <i class="fa fa-plus" aria-hidden="true"></i>
        <p>Add Comments</p>
      </div>
      <div class="comments-label" v-if="showComments&&hasComments" @click="toggleComments">
        <i class="fa fa-chevron-up" aria-hidden="true"></i>
        <p>Hide Comments</p>
      </div>
      <div class="comments-label" v-if="showComments&&!hasComments" @click="toggleComments">
        <i class="fa fa-times" aria-hidden="true"></i>
        <p>Cancel</p>
      </div>
      <textarea  class="form-control" v-model="localItem.comments" v-if="showComments" rows="2" placeholder="Add a comment..."></textarea>
    </div>

    <div class="form-group" v-if="!itemIsEditable&&hasUserInput">
      <button type="button" class="btn btn-xs btn-list" @click.prevent="submitForm">Save</button>
      <button type="button" class="btn btn-xs btn-default" @click="resetForm">Cancel</button>
    </div>

    <template v-if="itemIsEditable">
      <div>
        <button type="button" class="btn btn-xs btn-list" @click.prevent="submitForm">Save</button>
        <button type="button" class="btn btn-xs btn-default" @click="cancelEditing">Cancel</button>
      </div>

      <div class="delete-item-btn-container">
        <i class="fa toggle-delete-item-btn" :class="deletabilityIcon" aria-hidden="true" @click="toggleDeletability"></i>
        <i class="fa fa-trash-o delete-item-btn" aria-hidden="true" v-if="isDeletable" @click="deleteItem"></i>
      </div>
    </template>
  </form>

</template>

<script>
import { mapActions, mapGetters } from 'vuex'

import Datepicker from 'vuejs-datepicker';

export default {
  name: 'item-form',
  props: ['item'],
  data () {
    return {
      chooseDate: false,
      showComments: false,
      isDeletable: false,
      localItem: {}
    }
  },
  computed: {
    ...mapGetters([
      'editableItems',
      'checklist'
    ]),
    deadlinePlaceholder: function () {
      return this.localItem.deadline ? moment(this.localItem.deadline).format('MMM D') : '--'
    },
    itemIsEditable: function() {
      return this.editableItems.indexOf(this.item.id) !== -1
    },
    hasContent: function() {
      return this.localItem.content ? true : false
    },
    hasComments: function() {
      return this.localItem.comments ? true : false
    },
    hasUserInput: function() {
      return this.localItem.content || this.localItem.is_important || this.localItem.is_urgent || this.localItem.deadline
    },
    deletabilityIcon: function() {
      return this.isDeletable ? 'fa-times' : 'fa-trash-o'
    }
  },
  methods: {
    ...mapActions([
      'updateChecklistItem',
      'deleteChecklistItem',
      'setEditability'
    ]),
    setDate: function(date) {
      this.localItem.deadline = moment(date).format('YYYY-MM-DD')
      return this.hideDatePicker()
    },
    toggleComments: function() {
      return this.showComments = ! this.showComments
    },
    showDatePicker: function() {
      return this.chooseDate = true
    },
    hideDatePicker: function() {
      return this.chooseDate = false
    },
    toggleDeletability: function() {
      return this.isDeletable = ! this.isDeletable
    },
    submitForm: function() {
      this.hideDatePicker()
      if (this.localItem.content) {
        this.$emit('submitForm', this.localItem)
      }
      if (!this.itemIsEditable) {
        this.initializeLocalItem()
      }
    },
    cancelEditing: function() {
      this.setEditability({editable: false, id:this.item.id })
    },
    resetForm: function() {
      this.initializeLocalItem()
      this.showComments = false
    },
    initializeLocalItem: function() {
      this.localItem = {
        content: this.item.content,
        deadline: this.item.deadline ? this.item.deadline : undefined,
        is_urgent: this.item.is_urgent,
        is_important: this.item.is_important,
        comments: this.item.comments ? this.item.comments : undefined,
        id: this.item.id ? this.item.id : undefined,
        fake_id: this.item.fake_id ? this.item.fake_id : undefined
      }
    },
    deleteItem: function() {
      this.deleteChecklistItem({item:this.item})
    },
    removeDeadline: function() {
      return this.localItem.deadline = null
    }
  },
  components: {
    Datepicker
  },
  created: function() {
    this.initializeLocalItem()
  }
}
</script>
