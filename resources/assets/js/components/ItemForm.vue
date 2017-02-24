<template lang="html">
  <form class="item-form-container" :class="{ 'edit-item-form': itemIsEditable }" @submit.prevent="submitForm">
    <div class="item-form">
      <div class="item-form-content col-sm-12 col-md-8">
        <input type="text" v-model="localItem.content" placeholder="Add item..." maxlength="255">
      </div>

      <item-form-meta
        :item="localItem"
        v-if="itemIsEditable||hasContent"
        @showDatePicker="showDatePicker"
      ></item-form-meta>
    </div>

    <div class="datepicker-container" v-if="chooseDate">
      <datepicker
        value="item.deadline"
        @selected="setDate"
        :inline="true"
      ></datepicker>
    </div>

    <item-form-comments
      :item="localItem"
      v-if="hasUserInput"
    ></item-form-comments>

    <item-form-buttons
      :item="localItem"
      :hasUserInput="hasUserInput"
      :itemIsEditable="itemIsEditable"
      @resetForm="initializeLocalItem"
      @submitForm="submitForm"
    ></item-form-buttons>
  </form>

</template>

<script>
import { mapActions, mapGetters } from 'vuex'

import ItemFormButtons from './ItemFormButtons.vue'
import ItemFormComments from './ItemFormComments.vue'
import ItemFormMeta from './ItemFormMeta.vue'
import Datepicker from 'vuejs-datepicker';

export default {
  name: 'item-form',
  props: ['item'],
  data () {
    return {
      chooseDate: false,
      localItem: {}
    }
  },
  computed: {
    ...mapGetters([
      'editableItems',
      'checklist'
    ]),
    itemIsEditable: function() {
      return this.editableItems.indexOf(this.item.id) !== -1
    },
    hasContent: function() {
      return this.localItem.content ? true : false
    },
    hasUserInput: function() {
      return this.localItem.content
      || this.localItem.is_important
      || this.localItem.is_urgent
      || this.localItem.deadline
    }
  },
  methods: {
    ...mapActions([
      'updateChecklistItem',
      'setEditability'
    ]),
    setDate: function(date) {
      date ? this.localItem.deadline = moment(date).format('YYYY-MM-DD') : this.localItem.deadline = undefined
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
      if (this.localItem.content) {
        this.$emit('submitForm', this.localItem)
      }
      if (!this.itemIsEditable) {
        this.initializeLocalItem()
      }
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
    }
  },
  components: {
    Datepicker,
    ItemFormButtons,
    ItemFormComments,
    ItemFormMeta
  },
  created: function() {
    this.initializeLocalItem()
  }
}
</script>
