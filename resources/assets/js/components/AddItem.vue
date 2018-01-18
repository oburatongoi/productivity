<template lang="html">
  <form class="add-item" @submit.prevent="submitForm">
    <div class="item-form">
      <div class="item-form-content">
        <i
          class="fa fa-fw fa-plus item-form-icon"
          aria-hidden="true"
        />
        <input
          type="text"
          v-model="newItem.content"
          placeholder="Add item..."
          maxlength="255"
          class="item-form-input"
          v-focus
        >
      </div>

      <item-form-meta
        v-if="hasContent"
        :item="newItem"
        :is-sub-item="isSubItem"
        :parent-model="parentModel"
        @showDatePicker="showDatePicker"
      />
    </div>

    <template v-if="hasUserInput">
      <div class="datepicker-container" v-if="chooseDate">
        <div class="delete-deadline">
          <button v-if="newItem.deadline" type="button" class="btn btn-xs btn-default" @click="setDate(null)">
            <i class="fa fa-fw fa-calendar-times-o" aria-hidden="true"/>
               Remove Deadline
          </button>
          <button type="button" class="btn btn-xs btn-default" @click="hideDatePicker">
            <i class="fa fa-fw fa-times" aria-hidden="true"/>
               Cancel
          </button>
        </div>

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
    <resize-observer @notify="emitResize" />
  </form>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

import AddItemFormButtons from './AddItemFormButtons.vue'
import AddItemFormComments from './AddItemFormComments.vue'
import ItemFormMeta from './ItemFormMeta.vue'
import Datepicker from 'vuejs-datepicker';

export default {
  name: 'add-item',
  components: {
    Datepicker,
    AddItemFormButtons,
    AddItemFormComments,
    ItemFormMeta
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
      newItem: undefined, //set when created
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
    },
    isSubItem: function() {
      return this.parentModel == 'checklist-item' ? true : false;
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
          content: null,
          is_urgent: undefined,
          is_important: undefined,
          deadline: undefined,
          comments: undefined,
          sort_order: undefined,
          isNewItem: true,
      }
      this.setSortOrder()
      this.isSaving = false
    },
    setDate: function(date) {
      date ? this.newItem.deadline = moment(date).format('YYYY-MM-DD') : this.newItem.deadline = undefined
      this.hideDatePicker()
      return this.$eventHub.$emit('resizeInput');
    },
    setSortOrder: function() {
      switch (this.parentModel) {
        case 'checklist-item':
          this.newItem.sort_order = this.parent.children ? this.parent.children.length : 0
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
      if (!this.hasContent) return
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
    },
    emitResize: function() {
      return this.$eventHub.$emit('resizeInput');
    },
  },
}
</script>

<style lang="scss">
.add-item {
    position: relative;
    .edit-checklist-item & {
      margin-top: 10px;
    }
}

.item-form {
    width: 100%;
    padding: 0px;
    border: 1px solid $item-form-border-color;
    border-radius: 5px;
    overflow: hidden;
    background: white;
    position: relative;

    .item-form-content {
        vertical-align: middle;
        width: 100%;
        height: $item-form-height;
        padding: 0;
        padding-left: 5px;
        background: transparent;
        overflow: hidden;
        @media(min-width:768px){
            width: 70%;
        }
        @media(min-width:992px){
            width: 70%;
            min-width: 300px;
        }
        @media(min-width:1200px){
            width: 80%;
        }

        .fa-plus {
          line-height: $item-form-height;
          font-size: 1.1em;
          color: $brand-primary;
        }

        input {
            border: 0;
            outline: none;
            width: 85%;
            height: 100%;
            padding-left: 10px;
            background: transparent;
            font-weight: $font-weight-normal;
            font-family: $paragraph-font-family-sans-serif;
            @media(min-width:768px){
                width: 85%;
                padding-left: 5px;
            }
            @media(min-width:992px){
                width: 85%;
            }
            @media(min-width:1200px){
                width: 85%;
            }
        }
    }

}

</style>
