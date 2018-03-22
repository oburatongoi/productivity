<template lang="html">
  <div class="edit-checklist-item-meta">
    <span class="deadline">
      <label for="deadline">{{ deadlinePlaceholder }}</label>
      <i @click="showDatePicker"
        :class="{'folder-color-scheme':item.deadline, 'fa-spin':deadlineIsLoading}"
        class="far fa-fw fa-calendar-alt"
        aria-hidden="true"/>

        <div class="datepicker-container" v-if="chooseDate">
          <div class="delete-deadline">
            <button v-if="item.deadline" type="button" class="btn btn-xs btn-default" @click="setDate(null)">
              <i class="far fa-fw fa-calendar-times" aria-hidden="true"/>
                 Remove Deadline
            </button>
            <button type="button" class="btn btn-xs btn-default" @click="hideDatePicker">
              <i class="far fa-fw fa-times" aria-hidden="true"/>
                 Cancel
            </button>
          </div>

          <datepicker
            v-model="item.deadline"
            @selected="setDate"
            :inline="true"
            :format="dateFormatter"
            :highlighted="highlightedDate"
          />
        </div>
    </span>
    
    <span class="is-important">
      <label for="is-important">Important</label>
      <i v-if="!item.is_important"
         @click="toggleImportance"
         class="far fa-fw fa-exclamation-circle"
         aria-hidden="true"/>
      <i v-if="item.is_important"
         @click="toggleImportance"
         :class="{'folder-color-scheme':item.is_important, 'fa-spin':importanceIsLoading}"
         class="fas fa-fw fa-exclamation-circle"
         aria-hidden="true"/>
    </span>

    <span class="is-urgent">
      <label for="is-urgent">Urgent</label>
      <i @click="toggleUrgency"
        :class="{'folder-color-scheme':item.is_urgent, 'fa-spin':urgencyIsLoading}"
        class="far fa-fw fa-clock"
        aria-hidden="true"/>
    </span>

  </div>
</template>

<script>
import { mapActions } from 'vuex'
import Datepicker from 'vuejs-datepicker';

export default {
  name: 'edit-checklist-item-meta',
  components: {
      Datepicker
  },
  props: {
    item: {
      type: Object,
      required: true
    },
    isSubItem: {
      type: Boolean,
      default: false
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
    highlightedDate () {
      return {
        dates: [
          this.item.deadline ? new Date(this.item.deadline) : new Date()
        ]
      }
    },
    deadlinePlaceholder: function() {
      return this.item.deadline ? 'Due: ' + moment(this.item.deadline).format('MMM D, YYYY') : 'No Deadline'
    }
  },
  methods: {
    ...mapActions([
      'setChecklistItemDeadline',
      'toggleChecklistItemImportance',
      'toggleChecklistItemUrgency'
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
      this.setChecklistItemDeadline({item: this.item, date, isSubItem: this.isSubItem})
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
      this.toggleChecklistItemImportance(this.item)
          .then( () => this.importanceIsLoading = false )
          .catch( (error) => console.log(error) )
    },
    toggleUrgency: function() {
      this.urgencyIsLoading = true
      this.toggleChecklistItemUrgency(this.item)
          .then( () => this.urgencyIsLoading = false )
          .catch( (error) => console.log(error) )
    },
  },
}
</script>

<style lang="scss">
.datepicker-container {
  position: absolute;
  right: 10px;
  top: 15px;
  @include high-z-index(2);

  .far, .fas, .fal {
    font-size: 1em;
  }

  .delete-deadline {
    border-top: 1px solid $base-border-color;
    border-left: 1px solid $base-border-color;
    border-right: 1px solid $base-border-color;
    background: white;
    padding: 10px;
    text-align: center;
  }
}
</style>
