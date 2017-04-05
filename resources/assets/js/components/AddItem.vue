<template lang="html">
  <form class="item-form-container" @submit.prevent="submitForm">
    <div class="item-form">
      <div class="item-form-content col-sm-12 col-md-8">
        <input type="text" v-model="item.content" placeholder="Add item..." maxlength="255">
      </div>

      <add-item-form-meta
        :item="item"
        v-if="hasContent"
        @showDatePicker="showDatePicker"
      ></add-item-form-meta>
    </div>

    <div class="datepicker-container" v-if="chooseDate">
      <datepicker
        value="item.deadline"
        @selected="setDate"
        :inline="true"
      ></datepicker>
    </div>

    <add-item-form-comments
      :item="item"
      v-if="hasUserInput"
    ></add-item-form-comments>

    <add-item-form-buttons
      :item="item"
      :hasUserInput=hasUserInput
      :isSaving=isSaving
      @resetForm="resetItem"
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
      isSaving: false,
      item: {
        content: undefined,
        is_urgent: undefined,
        is_important: undefined,
        deadline: undefined,
        comments: undefined,
        addable: true
      }
    }
  },
  computed: {
    ...mapGetters([
      'checklist'
    ]),
    hasContent: function() {
      return this.item.content ? true : false
    },
    hasUserInput: function() {
      return this.item.content
      || this.item.is_important
      || this.item.is_urgent
      || this.item.deadline ? true : false
    }
  },
  methods: {
    ...mapActions([
      'addChecklistItem'
    ]),
    setDate: function(date) {
      date ? this.item.deadline = moment(date).format('YYYY-MM-DD') : this.item.deadline = undefined
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
        return this.addChecklistItem( {item: this.item} ).then(
          () => {
            this.isSaving = false
            this.resetItem()
          }
        ).catch(
          () => {console.log('Error has occured');}
        )
      }
    },
    resetItem: function() {
      this.item = {
        content: undefined,
        is_urgent: undefined,
        is_important: undefined,
        deadline: undefined,
        comments: undefined,
        addable: true
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
