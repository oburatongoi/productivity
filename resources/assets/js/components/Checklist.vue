<template>
  <div class="checklist position-relative" :class="checklistClass">
    <div class="panel main-panel" v-show="!editableSubItem.id">
      <div class="panel-heading">
          <h4 class="checklist-title">
            <i class="fa fa-fw fa-list"
              :class="[{'grey-color-scheme':isEditable}, checklistIconClass]"
              aria-hidden="true"/>
            <span v-if="!isEditable" @click="toggleEditability(true)">
              {{ checklist.title }}
            </span>
            <input type="text"
                   class="edit-checklist-input"
                   ref="titleinput"
                   v-model="checklist.title"
                   v-if="isEditable"
                   @keyup.enter="debounceSaveChanges"
                   @keyup="debounceSaveChanges"
                   @keydown="debounceSaveChanges"
                   @change="debounceSaveChanges"
                   @blur="debounceSaveChanges"
                   v-focus
            >
            <i class="fa fa-fw edit-checklist-icon"
              :class="inputIcon"
              aria-hidden="true"
              v-if="isEditable"
              @click="saveAndClose"
            />
          </h4>

          <div class="checklist-filters">
            <div class="pull-right">
              <div class="checked-filter" v-if="checklist.list_type!=='nu'">
                <span v-if="!selectingCheckedFilter" @click="toggleFilter('checked')">
                  {{ checkedFilterText }}
                  <i class="fa fa-angle-down" aria-hidden="true"/>
                </span>
                &nbsp;

                <ul :class="{ open: selectingCheckedFilter }" v-if="selectingCheckedFilter">
                  <li v-if="selectingCheckedFilter||filters.checked=='all'" @click="setCheckedFilter('all')">
                    <i class="fa fa-fw fa-globe" aria-hidden="true"/>
                    All
                  </li>
                  <li v-if="selectingCheckedFilter||filters.checked=='unchecked'" @click="setCheckedFilter('unchecked')">
                    <i class="fa fa-fw fa-square-o" aria-hidden="true"/>
                    Incomplete
                  </li>
                  <li v-if="selectingCheckedFilter||filters.checked=='checked'" @click="setCheckedFilter('checked')">
                    <i class="fa fa-fw fa-check-square" aria-hidden="true"/>
                    Completed
                  </li>
                </ul>
              </div>

              <div class="priority-filter">
                <span v-if="!selectingPriorityFilter" @click="toggleFilter('priority')">
                  {{ priorityFilterText }}
                  <i class="fa fa-angle-down" aria-hidden="true"/>
                </span>
                &nbsp;

                <ul :class="{ open: selectingPriorityFilter }" v-if="selectingPriorityFilter">
                  <li v-if="selectingPriorityFilter||filters.priority=='none'" @click="setPriorityFilter('none')">
                    <i class="fa fa-fw fa-globe" aria-hidden="true"/>
                    All (No Priority)
                  </li>
                  <li v-if="selectingPriorityFilter||filters.priority=='both'" @click="setPriorityFilter('both')">
                    <i class="fa fa-fw fa-exclamation-triangle" aria-hidden="true"/>
                    Important &amp; Urgent
                  </li>
                  <li v-if="selectingPriorityFilter||filters.priority=='important'" @click="setPriorityFilter('important')">
                    <i class="fa fa-fw fa-star" aria-hidden="true"/>
                    Important
                  </li>
                  <li v-if="selectingPriorityFilter||filters.priority=='urgent'" @click="setPriorityFilter('urgent')">
                    <i class="fa fa-fw fa-clock-o" aria-hidden="true"/>
                    Urgent
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <add-item
            v-if="!isEditable"
            :parent="checklist"
            parent-model="checklist"
            @onResize="debounceResizeInput"
          />
      </div>

      <div class="checklist-index-panel panel-body">
          <checklist-items
            v-if="!isEditable"
            :list-type="checklist.list_type"
            :items="checklistItems"
            parent-model="checklist"
            :parent="checklist"
          />

          <edit-checklist
            v-if="isEditable"
            @close="saveAndClose"
            @saveChanges="saveChanges"
            :checklist="checklist"
            :is-saving="isSaving"
          />
      </div>
      <resize-observer @notify="debounceResizeInput" />
    </div>

    <checklist-item-tree
      v-if="!selectedIsMovable&&editableSubItem.id"
      :item="editableItem"
      :checklist="checklist"
      :folder="parentFolder"
      parent-component="checklist"
      @onSelection="toggleSelection"
    />

    <edit-checklist-item
      v-if="!selectedIsMovable&&editableItem.id"
      :list-type="checklist.list_type"
      :item="editableItem"
      parent-model="checklist"
      @onResize="debounceResizeInput"
    />

    <edit-checklist-item
      v-if="!selectedIsMovable&&editableSubItem.id"
      :list-type="checklist.list_type"
      :item="editableSubItem"
      parent-model="checklist-item"
      @onResize="debounceResizeInput"
    />

    <move-to-checklist v-if="selectedIsMovable"/>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

import ChecklistItems from './ChecklistItems.vue'
import ChecklistItemTree from './ChecklistItemTree.vue'
import Breadcrumbs from './Breadcrumbs.vue'
import AddItem from './AddItem.vue'
import EditChecklist from './EditChecklist.vue'
import EditChecklistItem from './EditChecklistItem.vue'
import MoveToChecklist from './MoveToChecklist.vue'

export default {
  name: 'checklist',
  components: {
      ChecklistItems,
      ChecklistItemTree,
      Breadcrumbs,
      AddItem,
      EditChecklist,
      EditChecklistItem,
      MoveToChecklist
  },
  data () {
    return {
      isEditable: false,
      isSaving: false,
      inputIcon: 'fa-times',
      unsavedChanges: false,
      selectingCheckedFilter: false,
      selectingPriorityFilter: false
    }
  },
  computed: {
    ...mapGetters([
      'checklist',
      'checklistItems',
      'currentFolder',
      'editableItem',
      'editableSubItem',
      'editableItemIsExpanded',
      'editableSubItemIsExpanded',
      'selectedIsMovable',
      'filters'
    ]),
    checklistClass: function() {
      return  this.editableSubItemIsExpanded ? 'has-expanded-editable-sub-item':
              this.editableSubItem.id        ? 'has-editable-sub-item'         :
              this.editableItemIsExpanded    ? 'has-expanded-editable-item'    :
              this.editableItem.id           ? 'has-editable-item'             :
                                                null                           ;
    },
    checklistIconClass: function() {
      return ! this.checklist.list_type         ? 'fa-list'         :
               this.checklist.list_type == 'ch' ? 'fa-list'         :
               this.checklist.list_type == 'ta' ? 'fa-check-square' :
               this.checklist.list_type == 'bu' ? 'fa-list-ul'      :
               this.checklist.list_type == 'nu' ? 'fa-list-ol'      :
                                                  'fa-list'         ;
    },
    checkedFilterText: function() {
      var text
      switch (this.filters.checked) {
        case 'all':
          text = 'All'
          break;
        case 'checked':
          text = 'Completed'
          break;
        case 'unchecked':
          text = 'Incomplete'
          break;
        default: text = this.filters.checked
      }
      return text
    },
    priorityFilterText: function() {
      var text
      switch (this.filters.priority) {
        case 'none':
          text = 'No Priority'
          break;
        case 'both':
          text = 'Important & Urgent'
          break;
        case 'important':
          text = 'Important'
          break;
        case 'urgent':
          text = 'Urgent'
          break;
        default: text = this.filters.priority
      }
      return text
    },
    parentFolder: function() {
      return this.checklist.folder ? this.checklist.folder : this.checklist.folder_id && this.currentFolder && this.checklist.folder_id == this.currentFolder.id ? this.currentFolder : null
    },
    percentComplete: function() {
      return this.checklist.list_type && this.checklist.list_type == 'ta' ? ((this.checklistItems.length - _.countBy(this.checklistItems, i => i.checked_at == null).true) / this.checklistItems.length) * 100 : null
    }
  },
  mounted: function() {
    this.$nextTick(function () {
      if (!this.checklist.list_type) {
        return this.toggleEditability(true)
      }
    })
  },
  created: function() {
    this.$eventHub.$on('debounceResizeInput', this.debounceResizeInput);
    this.$eventHub.$on('toggleSelection', this.toggleSelection);
  },
  beforeDestroy: function() {
    this.$eventHub.$off('debounceResizeInput', this.debounceResizeInput);
    this.$eventHub.$off('toggleSelection', this.toggleSelection);
  },
  methods: {
    ...mapActions([
      'saveChecklist',
      'toggleSelection',
      'setFilters'
    ]),
    saveAndClose: function() {
      if (this.unsavedChanges == true) {
        this.saveChanges()
      }
      this.toggleEditability(false)
    },
    debounceSaveChanges: _.debounce(function() {
      this.unsavedChanges = true
      this.saveChanges()
    }, 1000),
    saveChanges: function() {
        this.inputIcon = 'fa-spin fa-circle-o-notch'
        this.isSaving = true
        this.saveChecklist(this.checklist)
            .then(
              (checklist) => {
                this.inputIcon = 'fa-times'
                this.isSaving = this.unsavedChanges = false
              })
            .catch(
              () => {
                this.inputIcon = 'fa-times'
                console.log('Error saving List');
              })
    },
    setCheckedFilter: function(filter){
      this.setFilters({type: 'checked', value: filter})
      return this.toggleFilter()
    },
    setPriorityFilter: function(filter){
      this.setFilters({type: 'priority', value: filter})
      return this.toggleFilter()
    },
    toggleFilter: function(type = null){
      this.selectingCheckedFilter = this.selectingPriorityFilter = false
      switch (type) {
        case 'checked':
          return this.selectingCheckedFilter = ! this.selectingCheckedFilter
          break;
        case 'priority':
          return this.selectingPriorityFilter = ! this.selectingPriorityFilter
          break;
        default: return

      }
    },
    toggleEditability: function(bool = "unset") {

      if (bool !== "unset") {
        this.isEditable = bool
      } else {
        this.isEditable = ! this.isEditable
      }
    },
    debounceResizeInput: _.debounce(function() {
      this.resizeInput()
    }, 300),
    resizeInput: function() {
      console.log('resizing...');
      this.$nextTick( function() {
        let count = 1,
            minWidth = 275;

        for (let form of document.getElementsByClassName('item-form')) {
          let content = form.querySelector('.item-form-content'),
              input = form.querySelector('.item-form-input'),
              icon = form.querySelector('.item-form-icon'),
              meta = form.querySelector('.item-form-meta');

          let resetStyles = function() {
            if (icon) icon.style = ''
            if (meta) meta.style = ''
            if (content) content.style = ''
            if (input) input.style = ''
          }

          resetStyles()

          let formWidth = form ? $(form).outerWidth(true) : 0,
              contentWidth = content ? $(content).outerWidth(true) : 0,
              inputWidth = input ? $(input).outerWidth(true) : 0,
              iconWidth = icon ? $(icon).outerWidth(true) : 0,
              metaWidth = meta ? $(meta).outerWidth(true) : 0;

          // console.log('formWidth = '+formWidth);
          // console.log('contentWidth = '+contentWidth);
          // console.log('inputWidth = '+inputWidth);
          // console.log('iconWidth = '+iconWidth);
          // console.log('metaWidth = '+metaWidth);

          let computedContentWidth = contentWidth > minWidth && formWidth - metaWidth > minWidth ? formWidth - metaWidth : null;

          let computedInputWidth = computedContentWidth && computedContentWidth - iconWidth - 10 >= minWidth ? computedContentWidth - iconWidth - 10 : null;



          // console.log('form number '+ count);
          count ++

          if(computedContentWidth) {
            content.style.width = computedContentWidth+'px'
          };

          if(computedInputWidth) {
            input.style.width = computedInputWidth+'px'
          } else {
            icon.style.display = 'none'
            content.style.padding = '0'
            content.style.width = input.style.width = '100%'
            if (meta) {
              meta.style.width = '100%'
              meta.style.position = 'relative'
              meta.style.display = 'block'
              meta.style.borderLeft = '0'
              meta.style.borderTop = '1px solid #ccd0d2'
            }
          };
        }
      })
    }, // End resizeInput
  }, // End methods
}
</script>

<style lang="scss">

// .deadline-input {
//     width: 150px;
//     display: inline-block;
//     vertical-align: middle;
//     label {
//         margin:0;
//         margin-right: 10px;
//     }
// }


.checklist {
    height: 100%;
    @include desktop-overflow-y;

    .main-panel {
        height: 100%;
        @include desktop-overflow-y;
        .panel-heading {
            padding-bottom: 0;
        }
    }

    .side-panel {
        @include desktop-overflow-y;
        height: 100%;
    }
    .checklist-index-panel {
        height: 75%;
        overflow-y: scroll;
        padding-top: 0;
    }
    .show-item-content-input,
    .show-item-content {
        font-weight: $font-weight-normal;
        color: $grey-text-color;
    }
    &.has-expanded-editable-item {
        .main-panel {
            display: none;
        }

        .side-panel {
            width: 100%;
        }
    }
    &.has-expanded-editable-sub-item {
      .side-panel.checklist-item-tree,
      .side-panel.checklist-item,
      .main-panel {
          display: none;
      }

      .side-panel.sub-checklist-item {
          width: 100%;
      }
    }

    &.has-editable-sub-item,
    &.has-editable-item {
      @media(min-width:769px){
          .main-panel,
          .side-panel {
              display: inline-block;
              vertical-align: top;
          }
        }

        .show-item-content-input,
        .show-item-content {
            width: 60%;
            font-size: 0.9em;
            line-height: 1.2;
            @media(min-width:768px){
                width: 50%;
                padding: 5px 0;
            }
            @media(min-width:992px){
                width: 50%;
                padding: 7px 0;
                font-size: 1em;
                line-height: 0.7em;
                white-space: nowrap;
                @include desktop-overflow-y;
                text-overflow: ellipsis;
            }
            @media(min-width:1200px){
                width: 60%;
                padding: 10px 0;
                font-size: 1.1em;
                line-height: 1em;
            }
            @media(min-width:1400px){
                width: 60%;
            }
        }

        .show-item-content-input {
            border: 0;
            outline: none;
        }
    }

    &.has-editable-item {
        @media(max-width:768px){
            .main-panel {
                display: none;
            }
            .side-panel {
                position: absolute;
                top: 56px;
                left: 10px;
                right: 10px;
                width: auto;
            }
        }

        @media(min-width:769px){
            .main-panel {
                width: 40%;
            }
            .side-panel {
                width: 58%;
                margin-left: 1%;
            }
        }

        @media(min-width:1200px){
            .main-panel {
                width: 45%;
            }
            .side-panel {
                width: 53%;
                margin-left: 1%;
            }
        }
    }

    &.has-editable-sub-item {
      .side-panel.checklist-item,
      .main-panel {
          display: none;
      }
        @media(max-width:768px){
            .side-panel.checklist-item-tree {
                display: none;
            }
            .side-panel.sub-checklist-item {
                position: absolute;
                top: 56px;
                left: 10px;
                right: 10px;
                width: auto;
            }
        }

        @media(min-width:769px){
            .side-panel.checklist-item-tree {
                width: 40%;
            }
            .side-panel.sub-checklist-item {
                width: 58%;
                margin-left: 1%;
            }
        }

        @media(min-width:1200px){
            .side-panel.checklist-item-tree {
                width: 45%;
            }
            .side-panel.sub-checklist-item {
                width: 53%;
                margin-left: 1%;
            }
        }
    }

    .edit-checklist-btn,
    .edit-checklist-icon {
        float: right;
    }
    .edit-checklist-btn {
        margin-top: 5px;
    }

    .edit-checklist-icon {
        margin-top: 8px;
        margin-left: 5px;
        font-size: 0.6em;
        cursor: pointer;
        color: $input-border;
        &.fa-circle-o-notch,
        &:hover {
            color: $brand-primary;
        }
    }

    .checklist-title span,
    .checklist-title .fa-list,
    .edit-checklist-input {
        vertical-align: text-top;
    }

    .checklist-title,
    .edit-checklist-input {
        font-weight: $font-weight-normal;
        font-family: $title-font-family;
    }
    .checklist-title span,
    .checklist-title .fa-list,
    .edit-checklist-input {
        line-height: 1.2;
        font-size: 1.25em;
    }
    .checklist-title span,
    .edit-checklist-input {
        width: 85%;
        padding: 0;
        margin:0;
    }


    .checklist-title  span{
        display: inline-block;
    }

    .checklist-title {
        color: $blue-text-color;
    }

    .edit-checklist-input {
        border: 0;
        color: $grey-text-color;
        outline: none;
    }

}

.checklist-filters {
    margin-bottom: 10px;
    @include clearfix;

    .checked-filter {
        ul {
            left: 0;
        }
    }
    .priority-filter {
        ul {
            right: 0;
        }
    }

    .checked-filter,
    .priority-filter {
        position: relative;
        display: inline-block;
        min-width: 100px;
        cursor: pointer;
        font-size: 0.9em;

        ul {
            position: absolute;
            top: 0;
            margin: 0;
            padding: 3px 6px;
            list-style: none;
            border-radius: $base-border-radius;
            min-width: 175px;

            &.open {
                border: 1px solid $base-border-color;
                z-index: 1000;
                background: white;
            }

            li {
                display: block;
                padding: 2px;
                border-radius: 2px;

                i.fa {
                    color: darken($base-border-color, 20%);
                }
                &:hover {
                    background: rgba(224,224,224,0.3);
                }

                &:not(:last-child) {
                    margin-bottom: 5px;
                }
            }
        }
    }
}


</style>
