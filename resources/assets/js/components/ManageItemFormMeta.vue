<template lang="html">
  <div class="manage-item-form-meta">
    <span class="is-important">
      <label for="is-important">Important</label>
      <i v-if="!item.is_important"
         @click="toggleImportance"
         :class="{'folder-color-scheme':item.is_important}"
         class="fa fa-fw fa-star-o"
         aria-hidden="true"></i>
      <i v-if="item.is_important"
         @click="toggleImportance"
         :class="{'folder-color-scheme':item.is_important, 'fa-spin':importanceIsLoading}"
         class="fa fa-fw fa-star"
         aria-hidden="true"></i>
    </span>

    <span class="is-urgent">
      <label for="is-urgent">Urgent</label>
      <i  @click="toggleUrgency"
          :class="{'folder-color-scheme':item.is_urgent, 'fa-spin':urgencyIsLoading}"
          class="fa fa-fw fa-clock-o"
          aria-hidden="true"></i>
    </span>

    <span class="deadline">
      <label for="deadline">{{deadlinePlaceholder}}</label>
      <i  @click="showDatePicker"
        :class="{'folder-color-scheme':item.deadline, 'fa-spin':deadlineIsLoading}"
        class="fa fa-fw fa-calendar-o"
        aria-hidden="true"></i>

        <div class="datepicker-container" v-if="chooseDate">
          <div class="delete-deadline">
            <button v-if="item.deadline" type="button" class="btn btn-xs btn-default" @click="setDate(null)">
              <i class="fa fa-fw fa-calendar-times-o" aria-hidden="true"></i>
                 Remove Due Date
            </button>
            <button type="button" class="btn btn-xs btn-default" @click="hideDatePicker">
              <i class="fa fa-fw fa-times" aria-hidden="true"></i>
                 Cancel
            </button>
          </div>

          <datepicker
            v-model="item.deadline"
            @selected="setDate"
            :inline="true"
            :format="dateFormatter"
            :highlighted="highlightedDate"
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
  props: {
    item: {
      type: Object,
      required: true
    }
  },
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
      'deadlinePlaceholder'
    ]),
    highlightedDate () {
      return {
        dates: [
          new Date(this.item.deadline)
        ]
      }
    }
  },
  methods: {
    ...mapActions([
      'setCurentEditableItemDeadline',
      'toggleCurentEditableItemImportance',
      'toggleCurentEditableItemUrgency'
    ]),
    dateFormatter(date) {
      return moment(date).format('YYYY-MM-DD');
    },
    showDatePicker: function() {
      return this.chooseDate = true
    },
    hideDatePicker: function() {
      return this.chooseDate = false
    },
    setDate: function(date = null) {
      this.deadlineIsLoading = true
      this.setCurentEditableItemDeadline(date)
          .then( (success) => {
            this.hideDatePicker()
            this.deadlineIsLoading = false
          })
          .catch( (error) => {
            this.hideDatePicker()
            console.log(error)
          })
    },
    toggleImportance: function() {
      this.importanceIsLoading = true
      this.toggleCurentEditableItemImportance()
          .then( () => this.importanceIsLoading = false )
          .catch( (error) => console.log(error) )
    },
    toggleUrgency: function() {
      this.urgencyIsLoading = true
      this.toggleCurentEditableItemUrgency()
          .then( () => this.urgencyIsLoading = false )
          .catch( (error) => console.log(error) )
    }
  },
  components: {
      Datepicker
  },
}
</script>
