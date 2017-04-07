<template lang="html">
  <div class="manage-checklist-item panel side-panel">
    <div class="sizing-buttons">
      <i class="fa fa-fw fa-times pull-right" v-if="!savingChanges" aria-hidden="true" @click="cancel"></i>
      <span class="fa-stack pull-right" v-if="savingChanges">
        <i class="fa fa-circle-o-notch fa-spin fa-stack-2x"></i>
        <i class="fa fa-floppy-o fa-stack-1x"></i>
      </span>
      <i class="fa fa-fw pull-left" :class="toggleExpansionClass" aria-hidden="true" @click="toggleCurrentEditableItemExpansion"></i>
    </div>

    <div class="panel-heading">
      <div class="edit-content">
        <h4 class="manage-checklist-item-content-textarea">
          <div class="pretty inline outline-success plain smooth">
            <input type="checkbox" :checked="currentEditableItem.checked_at" @click="checkItem"/>
            <label><i class="fa" :class="checkboxClass"></i></label>
          </div>

          <textarea
            v-model="currentEditableItem.content"
            class="content-textarea"
            @keyup="debounceSaveChanges"
            @keydown="debounceSaveChanges"
            @delete="debounceSaveChanges"
            @change.blur="saveChanges"
          ></textarea>
        </h4>
      </div>
    </div>

    <div class="panel-body position-relative">
      <manage-item-form-meta></manage-item-form-meta>

      <manage-item-form-comments
        @saveChanges="saveChanges"
        :item="currentEditableItem"
      ></manage-item-form-comments>

      <manage-item-form-buttons
        :item="currentEditableItem"
        :isSaving="savingChanges"
        @resetForm="cancel"
        @saveChanges="saveChanges"
      ></manage-item-form-buttons>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

import ManageItemFormMeta from './ManageItemFormMeta.vue'
import ManageItemFormComments from './ManageItemFormComments.vue'
import ManageItemFormButtons from './ManageItemFormButtons.vue'

import autosize from 'autosize';

export default {
  name: 'manage-checklist-item',
  data () {
    return {
      savingChanges: false,
      checkboxClass: 'fa-check',
      // itemClone: {}
    }
  },
  methods: {
    ...mapActions([
      'toggleCurrentEditableItemExpansion',
      'saveCurrentEditableItem',
      'addCurrentlyEditable',
      'removeCurrentlyEditable'
    ]),
    cancel: function() {
      this.removeCurrentlyEditable()
      this.addCurrentlyEditable(this.currentEditableItem)
    },
    debounceSaveChanges: _.debounce(function() {
      this.saveChanges()
    }, 500),
    saveChanges: function() {
      this.savingChanges = true
      this.saveCurrentEditableItem().then(
        () => this.savingChanges = false
      ).catch(
        () => alert('An Error Occured. Please copy your changes and refresh this page')
      )
    },
    checkItem: function() {
      this.checkboxClass = 'fa-circle-o-notch fa-spin'
      if (this.currentEditableItem.checked_at) {
        this.currentEditableItem.checked_at = null
      } else {
        this.currentEditableItem.checked_at = moment().format()
      }
      this.saveCurrentEditableItem(this.currentEditableItem)
          .then(
            () => {this.checkboxClass = 'fa-check'}
          )
          .catch(
            () => {this.checkboxClass = 'fa-check'}
          )
    },
    // cloneItem: function() {
    //   this.itemClone.content = this.currentEditableItem.content
    //   this.itemClone.comments = this.currentEditableItem.comments
    // }
  },
  computed: {
    ...mapGetters([
      'currentEditableItem',
      'currentEditableItemIsExpanded'
    ]),
    toggleExpansionClass: function() {
      return this.currentEditableItemIsExpanded ? 'fa-compress' : 'fa-expand'
    }
  },
  components: {
      ManageItemFormMeta,
      ManageItemFormComments,
      ManageItemFormButtons
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
