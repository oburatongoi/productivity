<template lang="html">
  <form class="add-item" @submit.prevent="submitForm">
    <div class="item-form">
      <div class="item-form-content col-sm-12 col-md-8">
        <input type="text" v-model="newChecklistItem.content" placeholder="Add item..." maxlength="255">
      </div>

      <add-item-form-meta
        v-if="hasContent"
        @showDatePicker="showDatePicker"
      ></add-item-form-meta>
    </div>

    <div class="datepicker-container" v-if="chooseDate">
      <datepicker
        value="newChecklistItem.deadline"
        @selected="setDate"
        :inline="true"
      ></datepicker>
    </div>

    <add-item-form-comments
      v-if="hasUserInput"
    ></add-item-form-comments>

    <add-item-form-buttons
      :hasUserInput=hasUserInput
      :isSaving=isSaving
      @resetForm="resetNewChecklistItem"
      @submitForm="submitForm"
    ></add-item-form-buttons>
  </form>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

import AddItemFormButtons from './AddItemFormButtons.vue'
import AddItemFormComments from './AddItemFormComments.vue'
import AddItemFormMeta from './AddItemFormMeta.vue'
import Datepicker from 'vuejs-datepicker';

export default {
  name: 'add-item',
  data () {
    return {
      chooseDate: false,
      isSaving: false
    }
  },
  computed: {
    ...mapGetters([
      'checklist',
      'newChecklistItem'
    ]),
    hasContent: function() {
      return this.newChecklistItem.content ? true : false
    },
    hasUserInput: function() {
      return this.newChecklistItem.content
      || this.newChecklistItem.is_important
      || this.newChecklistItem.is_urgent
      || this.newChecklistItem.deadline ? true : false
    }
  },
  methods: {
    ...mapActions([
      'addChecklistItem',
      'resetNewChecklistItem'
    ]),
    setDate: function(date) {
      date ? this.newChecklistItem.deadline = moment(date).format('YYYY-MM-DD') : this.newChecklistItem.deadline = undefined
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
      this.isSaving = true
      if (this.hasContent) {
        return this.addChecklistItem( {item: this.newChecklistItem} ).then(
          () => {
            this.isSaving = false
          }
        ).catch(
          () => {console.log('Error has occured');}
        )
      }
    }
  },
  components: {
    Datepicker,
    AddItemFormButtons,
    AddItemFormComments,
    AddItemFormMeta
  }
}
</script>
