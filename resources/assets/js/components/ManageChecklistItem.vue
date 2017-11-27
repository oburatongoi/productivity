<template lang="html">
  <div class="manage-checklist-item panel side-panel">
    <div class="position-relative">
      <div class="sizing-buttons">
        <i class="fa fa-fw fa-times pull-right" v-if="!savingChanges" aria-hidden="true" title="Save and Close" @click="saveAndClose"></i>
        <span class="fa-stack pull-right" v-if="savingChanges">
          <i class="fa fa-circle-o-notch fa-spin fa-stack-2x"></i>
          <i class="fa fa-floppy-o fa-stack-1x"></i>
        </span>
        <i class="fa fa-fw fa-exchange pull-right" aria-hidden="true" title="Move"  @click="toggleMovable"></i>
        <i class="fa fa-fw pull-left" :class="toggleExpansionClass" aria-hidden="true" :title="toggleExpansionTitle" @click="toggleCurrentEditableItemExpansion"></i>
      </div>

      <template>
        <div class="panel-heading">
          <div class="edit-content">
            <h4 class="manage-checklist-item-content-textarea">
              <span class="checkbox-container">
                <i class="fa fa-fw" :class="checkboxClass" aria-hidden="true" @click="checkItem"></i>
              </span>

              <textarea
                v-model="currentEditableItem.content"
                class="content-textarea"
                @keyup="debounceSaveChanges"
                @keydown="debounceSaveChanges"
                @delete="debounceSaveChanges"
                @change="debounceSaveChanges"
                maxlength="255"
              ></textarea>
            </h4>
          </div>

          <manage-item-form-meta></manage-item-form-meta>

          <div class="comments-label">
            <i class="fa fa-note" aria-hidden="true"></i>
            Notes
          </div>

          <div id="quill-toolbar">
            <span class="ql-formats">
              <button class="ql-bold" type="button"></button>
              <button class="ql-italic" type="button"></button>
              <button class="ql-underline" type="button"></button>
              <button class="ql-strike" type="button"></button>
            </span>

            <span class="ql-formats">
              <button class="ql-list" value="ordered" type="button"></button>
              <button class="ql-list" value="bullet" type="button"></button>
              <button class="ql-indent" value="-1" type="button"></button>
              <button class="ql-indent" value="+1" type="button"></button>
            </span>

            <span class="ql-formats">
              <button class="ql-link" type="button"></button>
              <button class="ql-script" value="sub" type="button"></button>
              <button class="ql-script" value="super" type="button"></button>
              <button class="ql-code-block" type="button"></button>
            </span>
          </div>
        </div>

        <div class="panel-body">
          <manage-item-form-comments
            @saveChanges="saveChanges"
          ></manage-item-form-comments>
        </div>

        <div class="panel-footer">
          <manage-item-form-buttons
            :isSaving="savingChanges"
            @resetForm="saveAndClose"
            @saveChanges="saveChanges"
          ></manage-item-form-buttons>
        </div>
      </template>

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
      checkboxClassOverride: null
    }
  },
  methods: {
    ...mapActions([
      'clearSelected',
      'toggleCurrentEditableItemExpansion',
      'saveCurrentEditableItem',
      'removeCurrentlyEditable',
      'toggleMovable'
    ]),
    saveAndClose: function() {
      this.saveChanges()
      this.removeCurrentlyEditable()
      this.clearSelected()
    },
    debounceSaveChanges: _.debounce(function() {
      this.saveChanges()
    }, 1000),
    saveChanges: function() {
      this.savingChanges = true
      this.saveCurrentEditableItem().then(
        () => this.savingChanges = false
      ).catch(
        (error) => console.log(error)
      )
    },
    checkItem: function() {
      this.checkboxClassOverride = 'fa-circle-o-notch fa-spin'
      if (this.currentEditableItem.checked_at) {
        this.currentEditableItem.checked_at = null
      } else {
        this.currentEditableItem.checked_at = moment().format()
      }
      this.saveCurrentEditableItem(this.currentEditableItem)
          .then(
            () => {this.checkboxClassOverride = null}
          )
          .catch(
            () => {this.checkboxClassOverride = null}
          )
    }
  },
  computed: {
    ...mapGetters([
      'currentEditableItem',
      'currentEditableItemIsExpanded'
    ]),
    checkboxClass: function() {
      return this.checkboxClassOverride ? this.checkboxClassOverride : this.currentEditableItem.checked_at ? 'fa-check' : 'fa-circle-thin'
    },
    toggleExpansionClass: function() {
      return this.currentEditableItemIsExpanded ? 'fa-compress' : 'fa-expand'
    },
    toggleExpansionTitle: function() {
      return this.currentEditableItemIsExpanded ? 'Compress' : 'Expand'
    }
  },
  components: {
      ManageItemFormMeta,
      ManageItemFormComments,
      ManageItemFormButtons
  },
  created: function() {
    this.$nextTick(function() {
      autosize(document.querySelector('.content-textarea'));
      autosize(document.querySelector('.comments-textarea'));
    })
  },
}
</script>

<style lang="css">
</style>
