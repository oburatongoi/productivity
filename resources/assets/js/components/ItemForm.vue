<template lang="html">
  <form class="item-form-container" :class="{ 'edit-item-form': modeIsEdit }" @submit.prevent="submitForm">
    <div class="item-form">
      <div class="item-form-content col-sm-12 col-md-9">
        <input type="text" v-model="item.content" placeholder="Add item...">
      </div>

      <div class="item-form-meta" v-if="!this.item.addable||this.item.addable&&hasContent">
        <span class="item-form-bool">
          <label for="is-important">Important</label>
          <input type="checkbox" id="is-important" v-model="item.is_important">
        </span>

        <span class="item-form-bool">
          <label for="is-urgent">Urgent</label>
          <input type="checkbox" id="is-urgent" v-model="item.is_urgent">
        </span>

        <span class="item-form-date">
          <label for="deadline">Deadline</label>
          <p @click="showDatePicker">
            <i class="fa fa-fw fa-calendar" aria-hidden="true"></i>
            {{deadlinePlaceholder}}
          </p>
        </span>
      </div>
    </div>

    <div class="datepicker-container" v-if="chooseDate">
      <datepicker value="item.deadline" @selected="setDate" :inline="true"></datepicker>
    </div>

    <div class="form-group" v-if="hasUserInput">
      <label for="deadline" class="comments-label" v-if="modeIsEdit">Comments</label>
      <textarea  class="form-control" v-model="item.comments" rows="2" placeholder="Add a comment..."></textarea>
    </div>

    <div class="form-group" v-if="!modeIsEdit&&hasUserInput">
      <button type="button" class="btn btn-xs btn-list" @click.prevent="submitForm">Save</button>
      <button type="button" class="btn btn-xs btn-default" @click="resetForm">Cancel</button>
    </div>

    <div class="form-group" v-if="modeIsEdit">
      <button type="button" class="btn btn-xs btn-list" @click.prevent="submitForm">Save</button>
      <button type="button" class="btn btn-xs btn-default" @click="cancelChanges">Cancel</button>
      <button type="button" class="btn btn-xs btn-default delete-item-btn" @click="deleteItem">
        <i class="fa fa-fw fa-trash-o" aria-hidden="true">
      </button>
    </div>
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
      chooseDate: false
    }
  },
  computed: {
    ...mapGetters([
      'editableItems',
      'checklist'
    ]),
    deadlinePlaceholder: function () {
      return this.item.deadline ? moment(this.item.deadline).format('MMM D') : '--'
    },
    modeIsEdit: function() {
      return this.editableItems.indexOf(this.item) !== -1
    },
    hasContent: function() {
      return this.item.content ? true : false
    },
    hasUserInput: function() {
      return this.item.content || this.item.is_important || this.item.is_urgent || this.item.deadline
    }
  },
  methods: {
    ...mapActions([
      'updateChecklistItem',
      'deleteChecklistItem'
    ]),
    setDate: function(date) {
      this.item.deadline = moment(date).format('YYYY-MM-DD')
      return this.hideDatePicker()
    },
    showDatePicker: function() {
      return this.chooseDate = true
    },
    hideDatePicker: function() {
      return this.chooseDate = false
    },
    submitForm: function() {
      this.hideDatePicker()
      if (this.item.content) {
        this.$emit('submitForm')
      }
    },
    cancelChanges: function() {
      this.$emit('resetForm')
    },
    resetForm: function() {
      this.$emit('resetForm')
    },
    deleteItem: function() {
      this.deleteChecklistItem({item:this.item})
    }
  },
  components: {
    Datepicker
  }
}
</script>
