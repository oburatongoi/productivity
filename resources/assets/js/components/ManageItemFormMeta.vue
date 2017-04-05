<template lang="html">
  <div class="manage-item-form-meta">
    <span class="is-important">
      <label for="is-important">Important</label>
      <i v-if="!currentEditableItem.is_important"
         @click="toggleImportance"
         :class="{'list-color-scheme':currentEditableItem.is_important}"
         class="fa fa-fw fa-star-o"
         aria-hidden="true"></i>
      <i v-if="currentEditableItem.is_important"
         @click="toggleImportance"
         :class="{'list-color-scheme':currentEditableItem.is_important, 'fa-spin':importanceIsLoading}"
         class="fa fa-fw fa-star"
         aria-hidden="true"></i>
    </span>

    <span class="is-urgent">
      <label for="is-urgent">Urgent</label>
      <i  @click="toggleUrgency"
          :class="{'list-color-scheme':currentEditableItem.is_urgent, 'fa-spin':urgencyIsLoading}"
          class="fa fa-fw fa-clock-o"
          aria-hidden="true"></i>
    </span>

    <span class="deadline">
      <label for="deadline">{{deadlinePlaceholder}}</label>
      <i  @click="showDatePicker"
        :class="{'list-color-scheme':currentEditableItem.deadline, 'fa-spin':deadlineIsLoading}"
        class="fa fa-fw fa-calendar-o"
        aria-hidden="true"></i>

        <div class="datepicker-container" v-if="chooseDate">
          <div class="delete-deadline">
            <button v-if="currentEditableItem.deadline" type="button" class="btn btn-xs btn-default" @click="removeDeadline">
              <i class="fa fa-fw fa-calendar-times-o" aria-hidden="true"></i>
                 Remove Due Date
            </button>
            <button type="button" class="btn btn-xs btn-default" @click="hideDatePicker">
              <i class="fa fa-fw fa-times" aria-hidden="true"></i>
                 Cancel
            </button>
          </div>

          <datepicker
            value="item.deadline"
            @selected="setDate"
            :inline="true"
          ></datepicker>
        </div>
    </span>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import Datepicker from 'vuejs-datepicker';

export default {
  name: 'manage-item-form-meta',
  data () {
    return {
      urgencyIsLoading: false,
      importanceIsLoading: false,
      deadlineIsLoading: false,
      chooseDate: false
    }
  },
  computed: {
    ...mapGetters([
      'currentEditableItem'
    ]),
    deadlinePlaceholder: function () {
      return this.currentEditableItem.deadline ? 'Due: '+moment(this.currentEditableItem.deadline).format('MMM D, YYYY') : 'No Due Date'
    },
  },
  methods: {
    ...mapActions([
      'saveCurrentEditableItem'
    ]),
    showDatePicker: function() {
      return this.chooseDate = true
    },
    hideDatePicker: function() {
      return this.chooseDate = false
    },
    setDate: function(date) {
      this.deadlineIsLoading = true
      date ? this.currentEditableItem.deadline = moment(date).format('YYYY-MM-DD') : this.currentEditableItem.deadline = undefined
      this.hideDatePicker()
      this.saveCurrentEditableItem().then(
        () => this.deadlineIsLoading = false
      )
    },
    removeDeadline: function() {
      this.currentEditableItem.deadline = null
      this.deadlineIsLoading = true
      this.hideDatePicker()
      this.saveCurrentEditableItem().then(
        () => this.deadlineIsLoading = false
      )
    },
    toggleImportance: function() {
      this.importanceIsLoading = true
      this.currentEditableItem.is_important = ! this.currentEditableItem.is_important
      this.saveCurrentEditableItem().then(
        (response) => this.importanceIsLoading = false
      )
    },
    toggleUrgency: function() {
      this.urgencyIsLoading = true
      this.currentEditableItem.is_urgent = ! this.currentEditableItem.is_urgent
      this.saveCurrentEditableItem().then(
        (response) => this.urgencyIsLoading = false
      )
    }
  },
  components: {
      Datepicker
  },
}
</script>
