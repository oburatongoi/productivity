<template lang="html">
  <form class="add-item" @submit.prevent="submitForm">
    <div class="item-form">
      <div class="item-form-content col-sm-12 col-md-8">
        <input type="text" v-model="newItem.content" placeholder="Add item..." maxlength="255">
      </div>

      <add-item-form-meta
        v-if="hasContent"
        :item="newItem"
        @showDatePicker="showDatePicker"
      />
    </div>

    <template v-if="hasUserInput">
      <div class="datepicker-container" v-if="chooseDate">
        <datepicker
          value="newItem.deadline"
          @selected="setDate"
          :inline="true"
          :highlighted="highlightedDate"
        />
      </div>

      <add-item-form-comments
        :item="newItem"
      />

      <add-item-form-buttons
        :has-user-input="hasUserInput"
        :is-saving="isSaving"
        @resetForm="resetNewItem"
        @submitForm="submitForm"
      />
    </template>
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
  components: {
    Datepicker,
    AddItemFormButtons,
    AddItemFormComments,
    AddItemFormMeta
  },
  props: {
    parent: {
      type: Object,
      required: true
    },
    parentModel: {
      type: String,
      default: 'checklist'
    }
  },
  data () {
    return {
      chooseDate: false,
      isSaving: false,
      newItem: undefined //set when created
    }
  },
  computed: {
    ...mapGetters([
      'checklistItems'
    ]),
    highlightedDate () {
      return {
        dates: [
          this.newItem.deadline ? new Date(this.newItem.deadline) : new Date()
        ]
      }
    },
    hasContent: function() {
      return this.newItem.content ? true : false
    },
    hasUserInput: function() {
      return this.newItem.content
      || this.newItem.is_important
      || this.newItem.is_urgent
      || this.newItem.deadline ? true : false
    }
  },
  created: function() {
    this.resetNewItem()
  },
  methods: {
    ...mapActions([
      'addChecklistItem',
      'addSubChecklistItem',
    ]),
    resetNewItem: function() {
      this.newItem = {
          content: undefined,
          is_urgent: undefined,
          is_important: undefined,
          deadline: undefined,
          comments: undefined,
          sort_order: undefined
      }
      this.setSortOrder()
      this.isSaving = false
    },
    setDate: function(date) {
      date ? this.newItem.deadline = moment(date).format('YYYY-MM-DD') : this.newItem.deadline = undefined
      return this.hideDatePicker()
    },
    setSortOrder: function() {
      switch (this.parentModel) {
        case 'checklist-item':
          this.newItem.sort_order = this.parent.child_list_items ? this.parent.child_list_items.length : 0
          break;
        default: this.newItem.sort_order = this.checklistItems ? this.checklistItems.length : 0
      }
    },
    showDatePicker: function() {
      return this.chooseDate = true
    },
    hideDatePicker: function() {
      return this.chooseDate = false
    },
    submitForm: function() {
      this.hideDatePicker()
      if (!this.hasContent) { return }
      this.isSaving = true
      switch (this.parentModel) {
        case 'checklist-item':
          return this.addSubChecklistItem( {item: this.newItem, parent: this.parent} )
                     .then( () => this.resetNewItem() )
                     .catch( () => console.log('Error has occured') )
          break;
        default: return this.addChecklistItem( {item: this.newItem, parent: this.parent} )
                            .then( () => this.resetNewItem() )
                            .catch( () => console.log('Error has occured') )
      }
    }
  },
}
</script>
