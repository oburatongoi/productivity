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
                <i class="fa fa-fw" :class="checkboxClass" aria-hidden="true" @click="checkItem" v-if="listType&&listType=='ch'||listType=='ta'"></i>
                <i class="fa fa-fw fa-circle" aria-hidden="true" v-if="listType&&listType=='bu'"></i>
                <span class="ol-number" aria-hidden="true" v-if="listType&&listType=='nu'">{{item.sort_order + 1}}.</span>
              </span>

              <textarea
                v-model="item.content"
                class="content-textarea"
                @keyup="debounceSaveChanges"
                @keydown="debounceSaveChanges"
                @delete="debounceSaveChanges"
                @change="debounceSaveChanges"
                maxlength="255"
              ></textarea>
            </h4>
          </div>

          <manage-item-form-meta :item="item"></manage-item-form-meta>

          <ul class="manage-item-menu">
            <li @click="switchView('notes')" :class="{ selected: view=='notes' }">
              <i class="fa fa-sticky-note-o" aria-hidden="true"></i>
              Notes
            </li>

            <li @click="switchView('sub-items')" :class="{ selected: view=='sub-items' }">
              <i class="fa fa-check-square" aria-hidden="true"></i>
              Lists <span class="list-items-count" v-if="item.child_list_items.length">({{item.child_list_items.length}})</span>
            </li>
          </ul>

          <template v-if="view=='notes'">
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
          </template>
        </div>

        <template v-if="view=='notes'">
          <div class="panel-body notes">
            <manage-item-form-comments
              @saveChanges="saveChanges"
              :item="item"
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

        <template v-if="view=='sub-items'">
          <div class="panel-body sub-items">
            <sub-checklist-items
              :items="item.child_list_items"
              :parent="item"
              :parent-model="'checklist-item'"
              :list-type="item.sub_list_type"
            ></sub-checklist-items>
          </div>
        </template>

      </template>

    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

import ManageItemFormMeta from './ManageItemFormMeta.vue'
import ManageItemFormComments from './ManageItemFormComments.vue'
import ManageItemFormButtons from './ManageItemFormButtons.vue'
import SubChecklistItems from './SubChecklistItems.vue'

import autosize from 'autosize';

export default {
  name: 'manage-checklist-item',
  props: {
    item: {
      type: Object,
      required: true
    },
    listType: {
      type: String,
      default: 'ch'
    }
  },
  data () {
    return {
      savingChanges: false,
      checkboxClassOverride: null,
      view: 'notes'
    }
  },
  methods: {
    ...mapActions([
      'clearSelected',
      'toggleCurrentEditableItemCheckMark',
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
      this.saveCurrentEditableItem()
      .then( () => this.savingChanges = false )
      .catch( (error) => console.log(error) )
    },
    checkItem: function() {
      this.checkboxClassOverride = 'fa-circle-o-notch fa-spin'
      this.toggleCurrentEditableItemCheckMark()
          .then( () => this.checkboxClassOverride = null )
          .catch( (error) => console.log(error))
    },
    switchView: function(view) {
      this.view = view
    }
  },
  computed: {
    ...mapGetters([
      'currentEditableItemIsExpanded',
    ]),
    checkboxClass: function() {
      return this.checkboxClassOverride ? this.checkboxClassOverride : this.item.checked_at ? 'fa-check' : 'fa-circle-thin'
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
      ManageItemFormButtons,
      SubChecklistItems
  },
  mounted: function() {
    this.$nextTick(function() {
      autosize(document.querySelector('.content-textarea'));
      autosize(document.querySelector('.comments-textarea'));
    })
  }
}
</script>

<style lang="scss">
.ol-number,
.fa-check {
    color: $brand-primary;
    font-size: 1em;
}

.ol-number {
    font-weight: bold;
}
.manage-checklist-item {
    @media(min-width:769px){
        border: 1px solid $brand-primary;
    }

    & > .position-relative {
        height: inherit;
        background: none;
    }


    .sizing-buttons {
        padding: 10px;
        padding-bottom: 0;
        height: 25px;
        overflow: visible;
        @include clearfix;
        text-align: center;

        .fa {
            cursor: pointer;
            color: $base-border-color;
            &:hover {
                color: $brand-primary;
            }
        }



        .fa-stack {
            margin-top: -5px;
            font-size: 0.75em;
            .fa-flopy-o {
                color: darken($base-border-color, 10%);
            }
            .fa-circle-o-notch {
                color: $brand-primary;
                opacity: 0.6;
            }
        }
    }

    .panel-heading {
        // padding-bottom: 10px;
        padding-bottom: 0;
        padding-top: 10px;
    }

    .panel-body {
        padding-top: 0 !important;
        padding-bottom: 0 !important;
        @include desktop-overflow-y-scroll;

        &.sub-items {
            height: 70%;
        }
        &.notes {
            height: 75%;
        }
    }



    .panel-footer {
        position: absolute;
        bottom: 0;
        right: 0;
        left: 0;
        border: 0;
        @include transparent-linear-gradient;
    }

    .item-form-buttons {
        background: transparent;
        @include clearfix;
        & > button {
            float: left;
        }

        .delete-item-btn-container {
            @include clearfix;
            @include desktop-overflow-y;
            float: right;
            display: inline-block;
            margin: 0;
            padding: 0;

            & > i.toggle-delete-item-btn,
            & > i.delete-item-btn {
                cursor: pointer;
                display: inline;
                float: right;
                vertical-align: middle;
                line-height: 1.4;
                font-size: 16px;
            }

            & > i.delete-item-btn {
                color: $brand-danger;
                background: white;
                margin-right: 10px;
            }

        }
    }

    .manage-checklist-item-content-textarea {
        margin: 0;
        padding: 0 0 3px 0;

        .checkbox-container {
            vertical-align: text-top;
        }
    }

    .edit-content {
        textarea {
            display: inline-block;
            vertical-align: top;
            border-radius: 2px;
            height: auto;
            margin: 0;
            resize: none;
            width: 85%;
            border: 1px solid white;
            outline: none;
            padding: 4px 4px 6px;
            font-size: 0.9em;
            // font-weight: $font-weight-light;
            font-weight: $font-weight-bold;
            &:focus {
                border: 1px dotted $brand-primary;
                color: black;
            }
            @media(max-width:768px){
                width: 83%;
            }
            @media(min-width:1000px){
                width: 81%;
            }
            @media(min-width:1200px){
                width: 85%;
            }
            @media(min-width:1433px){
                width: 90%;
            }
        }
    }


    .manage-item-menu {
        display: block;
        margin: 0;
        padding: 0;
        margin-top: 20px;
        margin-bottom: 5px;
        color: darken($base-border-color, 20%);
        font-size: 0.8em;
        font-family: $font-family-sans-serif;
        font-weight: 600;

        li {
          cursor: pointer;
          display: inline-block;
          padding-left: 3px;
          padding-right: 3px;
          &:not(:last-child) {
            margin-right: 5px;
          }
          &.selected {
            border-bottom: 2px solid $brand-primary;
          }
          &:hover {
            border-bottom: 2px solid;
          }
        }

        .list-items-count {
          font-size: 1em;

        }
    }

    .manage-item-form-meta {
        background: lighten($body-bg, 1%);
        // background: transparent;
        padding: 3px;
        border: 1px solid $base-border-color;
        border-radius: 2px;
        text-align: center;

        .is-important,
        .is-urgent,
        .deadline {
            display: inline-block;
            margin: 0;
            width: 32.5%;
            color: darken($base-border-color, 20%);

            label {
                display: block;
                margin: 0;
                font-size: 0.8em;
            }

            .fa {
                font-size: 1.1em;
                cursor: pointer;
            }
            &:nth-child(2) {
                border-left: 1px solid $base-border-color;
                border-right: 1px solid $base-border-color;
            }
        }
    }
}

</style>
