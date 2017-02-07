<template lang="html">
  <form :class="{ 'edit-item-form': modeIsEdit }" @submit.prevent="submitForm">
    <div class="item-form">
      <input type="text" class="item-form-content col-sm-12 col-md-7" v-model="item.content" placeholder="Add item...">
      <div class="item-form-meta col-sm-12 col-md-5" v-if="!this.item.addable||this.item.addable&&hasContent">
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
          <input type="date" v-model="item.deadline" v-if="chooseDate">
          <p @click="showDatePicker">
            <i class="fa fa-fw fa-calendar" aria-hidden="true">
            </i>{{deadlinePlaceholder}}
          </p>
        </span>
      </div>
    </div>

    <template v-if="modeIsEdit">
      <div class="form-group">
        <label for="deadline" class="comments-label">Comments</label>
        <textarea  class="form-control" v-model="item.comments" rows="2"></textarea>
      </div>

      <div class="form-group">
        <button type="button" class="btn btn-xs btn-list" @click.prevent="submitForm">Save</button>
        <button type="button" class="btn btn-xs btn-default" @click="cancelChanges">Cancel</button>
      </div>
    </template>

    <template v-if="!modeIsEdit&&hasUserInput">
      <div class="form-group">
        <button type="button" class="btn btn-xs btn-list" @click.prevent="submitForm">Save</button>
        <button type="button" class="btn btn-xs btn-default" @click="resetForm">Clear</button>
      </div>
    </template>
  </form>

</template>

<script>
import { mapActions, mapGetters } from 'vuex'
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
      return this.item.deadline ? this.item.deadline : '--'
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
      'updateChecklistItem'
    ]),
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
    }
  }
}
</script>
