<template lang="html">
  <div
  class="edit-checklist-item panel side-panel"
  :class="editChecklistItemClass"
  :id="'edit-checklist-item-'+item.id" >

    <div class="position-relative">

      <div
      class="sizing-buttons"
      :id="'sizing-buttons-'+item.id" >

        <span
        class="pull-right icon-and-label"
        v-if="!savingChanges&&!isSubItem"
        @click="saveAndClose" >

          <i
          class="far fa-times"
          aria-hidden="true"
          title="Save and Close" />
          Close
        </span>

        <span
        class="pull-right icon-and-label"
        v-if="savingChanges" >
          <span class="fa-layers">
            <i class="fal fa-circle-notch fa-spin"/>
            <i class="far fa-save fa-stack-1x" data-fa-transform="shrink-6"/>
          </span>
          Saving
        </span>

        <span
        class="pull-left icon-and-label"
        @click="saveAndClose" >
          <i
          class="far fa-chevron-left"
          aria-hidden="true"
          title="Back" />
          Back
        </span>

        <span
        class="pull-left icon-and-label"
        @click="toggleExpansion" >
          <i
          class="fa"
          :class="toggleExpansionClass"
          aria-hidden="true"
          :title="toggleExpansionTitle" />
          {{ toggleExpansionTitle }}
        </span>
      </div>

      <div
      class="panel-heading"
      :id="'panel-heading-'+item.id" >
        <div class="edit-content">

          <h4 class="edit-checklist-item-content-container">
            <span class="checkbox-container">
              <i
              class="fal fa-fw"
              :class="checkboxClass"
              aria-hidden="true"
              @click="checkItem"
              v-if="listType&&listType=='ch'||listType=='ta'" />

              <i
              class="fas fa-fw fa-circle"
              aria-hidden="true"
              v-if="listType&&listType=='bu'" />

              <span
              class="ol-number"
              aria-hidden="true"
              v-if="listType&&listType=='nu'" >
                {{ item.sort_order + 1 }}.
              </span>
            </span>

            <textarea
              v-model="item.content"
              class="content-textarea"
              :id="'content-textarea-'+item.id"
              @keyup="debounceSaveChanges"
              @keydown="debounceSaveChanges"
              @delete="debounceSaveChanges"
              @paste="debounceSaveChanges"
              @cut="debounceSaveChanges"
              maxlength="255"
            />
          </h4>
        </div>

        <edit-checklist-item-meta
        :item="item"
        :is-sub-item="isSubItem" />

        <ul class="manage-item-menu">
          <li
          @click="switchView('sub-items')"
          :class="{ selected: view=='sub-items' }" >
            <i
            class="far fa-tasks"
            aria-hidden="true" />
            Items
            <span
            class="list-items-count"
            v-if="uncheckedSubItemsCount" >
              ({{ uncheckedSubItemsCount }})
            </span>
          </li>

          <li
          @click="switchView('notes')"
          :class="{ selected: view=='notes' }" >
            <i
            class="far fa-sticky-note"
            aria-hidden="true" />
            Notes
          </li>
        </ul>

        <div id="quill-toolbar" v-if="view=='notes'">
          <span class="ql-formats">
            <button class="ql-bold" type="button"/>
            <button class="ql-italic" type="button"/>
            <button class="ql-underline" type="button"/>
            <button class="ql-strike" type="button"/>
          </span>

          <span class="ql-formats">
            <button class="ql-list" value="ordered" type="button"/>
            <button class="ql-list" value="bullet" type="button"/>
            <button class="ql-indent" value="-1" type="button"/>
            <button class="ql-indent" value="+1" type="button"/>
          </span>

          <span class="ql-formats">
            <button class="ql-link" type="button"/>
            <button class="ql-script" value="sub" type="button"/>
            <button class="ql-script" value="super" type="button"/>
            <button class="ql-code-block" type="button"/>
          </span>
        </div>

        <add-item
        v-if="view=='sub-items'"
        :parent="item"
        parent-model="checklist-item" />

      </div>

      <div
      class="panel-body notes"
      :id="'notes-panel-'+item.id"
      v-if="view=='notes'" >

        <edit-checklist-item-comments
        @saveChanges="saveChanges"
        :item="item"
        :is-sub-item="isSubItem" />

      </div>

      <div
      class="panel-body sub-items"
      :id="'sub-items-panel-'+item.id"
      v-if="view=='sub-items'" >
        <template v-if="item.sub_items">

          <div class="sub-checklist-items">
            <checklist-items
              :list-type="item.sub_list_type"
              :items="item.sub_items"
              parent-model="checklist-item"
              :parent="item"
            />
          </div>

        </template>
      </div>
    </div>

    <resize-observer @notify="debounceResizeNotes" />

  </div>

</template>

<script>
import { mapActions } from 'vuex'

import AddItem from './AddItem.vue'
import EditChecklistItemMeta from './EditChecklistItemMeta.vue'
import EditChecklistItemComments from './EditChecklistItemComments.vue'
import ChecklistItems from './ChecklistItems.vue'

export default {
  name: 'edit-checklist-item',
  components: {
    AddItem,
    EditChecklistItemMeta,
    EditChecklistItemComments,
    ChecklistItems
  },
  props: {
    item: {
      type: Object,
      required: true
    },
    listType: {
      type: String,
      default: 'ch'
    },
    parentContext: {
      type: String,
      default: 'checklist'
    }
  },
  data () {
    return {
      savingChanges: false,
      checkboxClassOverride: null,
      // view: 'notes',
      view: 'sub-items',
      notesHeight: '70%'
    }
  },
  computed: {
    checkboxClass: function() {
      return this.checkboxClassOverride ? this.checkboxClassOverride : this.item.checked_at ? 'fa-check' : this.isSubItem ? 'fa-square' : 'fa-circle'
    },
    editChecklistItemClass: function() {
      return this.item.checklist_id ? 'checklist-item' : 'sub-checklist-item'
    },
    toggleExpansionClass: function() {
      return this.item.isExpanded ? 'fa-compress-alt' : 'fa-expand-alt'
    },
    toggleExpansionTitle: function() {
      return this.item.isExpanded ? 'Shrink' : 'Expand'
    },
    uncheckedSubItemsCount: function() {
      return this.item.sub_items ? this.item.sub_items.filter( item => item.checked_at == null ).length : 0
    },
    isSubItem: function() {
      return this.item.parent_id && ! this.item.checklist_id;
    }
  },
  mounted: function() {
    this.$nextTick(function() {
      this.resizeNotes()
    })
  },
  methods: {
    ...mapActions([
      'closeNestedKanbanPreview',
      'removeCurrentlyEditable',
      'resizeInput',
      'saveChecklistItem',
      'toggleCurrentEditableItemExpansion',
      'toggleItemCheckMark',
    ]),
    saveAndClose: function() {
      this.saveChanges()
      switch (this.parentContext) {
        case 'checklist':
          this.removeCurrentlyEditable( { isSubItem: this.isSubItem, deselect: true } )
          break;
        case 'kanban':
          this.closeNestedKanbanPreview()
          break;
        default:

      }

    },
    debounceSaveChanges: _.debounce(function() {
      this.saveChanges()
    }, 1000),
    saveChanges: function() {
      this.savingChanges = true
      this.resizeNotes()

      this.saveChecklistItem(this.item)
      .then( () => this.savingChanges = false )
      .catch( (error) => console.log(error) )
    },
    checkItem: function() {
      this.checkboxClassOverride = 'fa-circle-notch fa-spin'
      this.toggleItemCheckMark(this.item)
          .then( () => this.checkboxClassOverride = null )
          .catch( (error) => console.log(error))
    },
    toggleExpansion: function() {
      this.toggleCurrentEditableItemExpansion(this.item)
    },
    switchView: function(view) {
      this.view = view
      this.$nextTick(function() {
        this.resizeNotes()
      })
    },
    debounceResizeNotes: _.debounce(function() {
      this.resizeNotes()
      this.resizeInput()
    }, 300),
    resizeNotes: function() {
      var panel = document.getElementById('edit-checklist-item-'+this.item.id);
      var header = document.getElementById('panel-heading-'+this.item.id);
      var topButtons = document.getElementById('sizing-buttons-'+this.item.id);

      var panelHeight = $(panel).outerHeight();
      var headerHeight = $(header).outerHeight(true);
      var topButtonsHeight = $(topButtons).outerHeight(true);
      var bottomButtonsHeight = 5;

      var target = document.getElementById(this.view+'-panel-'+this.item.id);
      var notesHeight = panelHeight - (headerHeight+bottomButtonsHeight+topButtonsHeight)
      if(target && notesHeight) target.style.height = notesHeight > 200 ? notesHeight+'px' : '200px'
    }
  },
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
.edit-checklist-item {
  height: 100%;
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

        // .far, .fas, .fal {
        //   cursor: pointer;
        //   color: $base-border-color;
        //   &:hover {
        //       color: $brand-primary;
        //   }
        // }

        .icon-and-label {
          cursor: pointer;
          color: $base-border-color;
          font-size: 0.85em;
          line-height: 1.2em;

          .far, .fas, .fal {
            font-size: 1.2em;
            line-height: inherit;
          }

          &:hover {
            color: $brand-primary;
          }

          &.pull-right {
            margin-left: 15px;
          }

          &.pull-left {
            margin-right: 15px;
          }
        }



        .fa-stack {
            // margin-top: -5px;
            // font-size: 0.75em;
            .fa-save{
                color: darken($base-border-color, 10%);
            }
            .fa-circle-notch {
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

        // &.sub-items {
        //     height: 70%;
        // }
        // &.notes {
        //     height: 75%;
        // }
    }



    .panel-footer {
        position: absolute;
        bottom: 0;
        right: 0;
        left: 0;
        border: 0;
        @include transparent-linear-gradient;
        max-height: 50px !important;
    }

    .item-form-buttons {
        background: transparent;
        @include clearfix;
        & > button {
            float: left;
        }

        .delete-item-btn-container {
            @include clearfix;
            @include desktop-overflow-y-no-scroll;
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

    .edit-checklist-item-content-container {
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
        font-weight: $font-weight-bold;

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

    .edit-checklist-item-meta {
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

            .far, .fas, .fal {
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

#quill-toolbar {
  padding: 2px;
}

</style>
