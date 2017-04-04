<template lang="html">
  <div class="manage-checklist-item panel side-panel">
    <div class="panel-heading">
      <i class="fa fa-fw fa-times pull-right" aria-hidden="true" @click="cancel"></i>
      <div class="edit-content">
        <h4 class="manage-checklist-item-content-textarea">
          <div class="pretty inline outline-success plain smooth">
            <input type="checkbox" :checked="currentEditableItem.checked_at" @click="checkItem"/>
            <label><i class="fa fa-check"></i></label>
          </div>

          <textarea v-model="currentEditableItem.content" class="content-textarea" @change.keyup.blur.delete="updateItem"></textarea>
        </h4>
      </div>
    </div>

    <div class="panel-body position-relative">
      <manage-item-form-meta
        @showDatePicker="showDatePicker"
      ></manage-item-form-meta>

      <!-- <div class="datepicker-container" v-if="chooseDate">
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
      </div> -->

      <item-form-comments
        :item="currentEditableItem"
        :showComments="showComments"
      ></item-form-comments>

      <item-form-buttons
        :item="currentEditableItem"
        :hasUserInput="hasUserInput"
        :itemIsEditable="itemIsEditable"
        @resetForm="cancel"
        @submitForm="updateItem"
      ></item-form-buttons>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

import ManageItemFormMeta from './ManageItemFormMeta.vue'
import ItemFormComments from './ItemFormComments.vue'
import ItemFormButtons from './ItemFormButtons.vue'
// import Datepicker from 'vuejs-datepicker';

import autosize from 'autosize';

export default {
  name: 'manage-checklist-item',
  data () {
    return {
      showComments: true,
      hasUserInput: true,
      itemIsEditable: true,
      // chooseDate: false
    }
  },
  methods: {
    ...mapActions([
      'removeCurrentlyEditable',
      'saveCurrentEditableItem',
      'setEditability',
      'check'
    ]),
    cancel: function() {
      this.removeCurrentlyEditable()
      this.setEditability({editable: false, item:this.currentEditableItem })
    },
    checkItem: function() {
      let action = '';
      if (this.currentEditableItem.checked_at) {
        action = 'uncheck'
      } else {
        action = 'check'
      }
      return this.check({ item: this.currentEditableItem, action: action })
                  .then(
                    (response) => this.initializeLocalItem(response.updatedItem),
                    (response) => {console.log('Error: No updated item was returned');}
                  )
    },
    updateItem: function() {
      // this.hideDatePicker()
      this.saveCurrentEditableItem()
    },
  //   showDatePicker: function() {
  //     return this.chooseDate = true
  //   },
  //   hideDatePicker: function() {
  //     return this.chooseDate = false
  //   },
  //   setDate: function(date) {
  //     date ? this.currentEditableItem.deadline = moment(date).format('YYYY-MM-DD') : this.currentEditableItem.deadline = undefined
  //     this.hideDatePicker()
  //     this.saveCurrentEditableItem()
  //   },
  //   removeDeadline: function() {
  //     this.currentEditableItem.deadline = null
  //     this.hideDatePicker()
  //     this.saveCurrentEditableItem()
  //   }
  },
  computed: {
    ...mapGetters([
      'currentEditableItem'
    ])
  },
  components: {
      ManageItemFormMeta,
      ItemFormComments,
      ItemFormButtons,
      // Datepicker
  },
  created: function() {
    this.$nextTick(function() {
      autosize(document.querySelector('textarea'));
    })
  }
}
</script>

<style lang="css">
</style>
