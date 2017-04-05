<template lang="html">
  <div class="manage-checklist-item panel side-panel">
    <div class="panel-heading">
      <i class="fa fa-fw fa-times pull-right" aria-hidden="true" @click="cancel"></i>
      <div class="edit-content">
        <h4 class="manage-checklist-item-content-textarea">
          <div class="pretty inline outline-success plain smooth">
            <input type="checkbox" :checked="currentEditableItem.checked_at" @click="checkItem"/>
            <label><i class="fa" :class="checkboxClass"></i></label>
          </div>

          <textarea v-model="currentEditableItem.content" class="content-textarea" @change.keyup.blur.delete="saveChanges"></textarea>
        </h4>
      </div>
    </div>

    <div class="panel-body position-relative">
      <manage-item-form-meta></manage-item-form-meta>

      <item-form-comments @saveChanges="saveChanges" :item="currentEditableItem"></item-form-comments>

      <item-form-buttons
        :item="currentEditableItem"
        :isSaving="savingChanges"
        @resetForm="cancel"
        @submitForm="saveChanges"
      ></item-form-buttons>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

import ManageItemFormMeta from './ManageItemFormMeta.vue'
import ItemFormComments from './ItemFormComments.vue'
import ItemFormButtons from './ItemFormButtons.vue'

import autosize from 'autosize';

export default {
  name: 'manage-checklist-item',
  data () {
    return {
      savingChanges: false,
      checkboxClass: 'fa-check',
    }
  },
  methods: {
    ...mapActions([
      'removeCurrentlyEditable',
      'saveCurrentEditableItem',
      'setEditability'
    ]),
    cancel: function() {
      this.removeCurrentlyEditable()
      this.setEditability({editable: false, item:this.currentEditableItem })
    },
    saveChanges: function() {
      this.savingChanges = true
      this.saveCurrentEditableItem().then(
        () => this.savingChanges = false
      )
    },
    checkItem: function() {
      this.checkboxClass = 'fa-check fa-spin'
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
    }
  },
  computed: {
    ...mapGetters([
      'currentEditableItem'
    ])
  },
  components: {
      ManageItemFormMeta,
      ItemFormComments,
      ItemFormButtons
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
