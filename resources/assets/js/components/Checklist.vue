<template>
  <div class="checklist" :class="checklistClass">
    <div class="panel main-panel">
      <div class="panel-heading">
          <h4 class="checklist-title">
            <i class="fa fa-fw fa-list" :class="{'grey-color-scheme':isEditable}" aria-hidden="true"></i>
            <span v-if="!isEditable" @click="toggleEditability(true)">
              {{checklist.title}}
            </span>
            <input
              type="text"
              class="edit-checklist-input"
              ref="titleinput"
              v-model="checklist.title"
              v-if="isEditable"
              @keyup.enter="debounceSaveChanges"
              @keyup="debounceSaveChanges"
              @keydown="debounceSaveChanges"
              @change="debounceSaveChanges"
              @blur="saveAndClose"
              v-focus
            />
            <i class="fa fa-fw edit-checklist-icon"
              :class="inputIcon"
              aria-hidden="true"
              v-if="isEditable"
              @click="saveAndClose"
            ></i>
          </h4>

          <div class="checklist-filters">
            <div class="pull-right">
              <div class="checked-filter">
                <span v-if="!selectingCheckedFilter" @click="toggleFilter('checked')">
                  {{checkedFilterText}}
                  <i class="fa fa-angle-down" aria-hidden="true"></i>
                </span>
                &nbsp;

                <ul :class="{ open: selectingCheckedFilter }" v-if="selectingCheckedFilter">
                  <li v-if="selectingCheckedFilter||filters.checked=='all'" @click="setCheckedFilter('all')">
                    <i class="fa fa-fw fa-globe" aria-hidden="true"></i>
                    All
                  </li>
                  <li v-if="selectingCheckedFilter||filters.checked=='unchecked'" @click="setCheckedFilter('unchecked')">
                    <i class="fa fa-fw fa-square-o" aria-hidden="true"></i>
                    Incomplete
                  </li>
                  <li v-if="selectingCheckedFilter||filters.checked=='checked'" @click="setCheckedFilter('checked')">
                    <i class="fa fa-fw fa-check-square" aria-hidden="true"></i>
                    Completed
                  </li>
                </ul>
              </div>

              <div class="priority-filter">
                <span v-if="!selectingPriorityFilter" @click="toggleFilter('priority')">
                  {{priorityFilterText}}
                  <i class="fa fa-angle-down" aria-hidden="true"></i>
                </span>
                &nbsp;

                <ul :class="{ open: selectingPriorityFilter }" v-if="selectingPriorityFilter">
                  <li v-if="selectingPriorityFilter||filters.priority=='none'" @click="setPriorityFilter('none')">
                    <i class="fa fa-fw fa-globe" aria-hidden="true"></i>
                    All (No Priority)
                  </li>
                  <li v-if="selectingPriorityFilter||filters.priority=='both'" @click="setPriorityFilter('both')">
                    <i class="fa fa-fw fa-exclamation-triangle" aria-hidden="true"></i>
                    Important &amp; Urgent
                  </li>
                  <li v-if="selectingPriorityFilter||filters.priority=='important'" @click="setPriorityFilter('important')">
                    <i class="fa fa-fw fa-star" aria-hidden="true"></i>
                    Important
                  </li>
                  <li v-if="selectingPriorityFilter||filters.priority=='urgent'" @click="setPriorityFilter('urgent')">
                    <i class="fa fa-fw fa-clock-o" aria-hidden="true"></i>
                    Urgent
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <add-item></add-item>
      </div>

      <div class="checklist-index-panel panel-body">
          <checklist-items></checklist-items>
      </div>
    </div>

    <manage-checklist-item v-if="currentEditableItem.id"></manage-checklist-item>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

import ChecklistItems from './ChecklistItems.vue'
import Breadcrumbs from './Breadcrumbs.vue'
import AddItem from './AddItem.vue'
import ManageChecklistItem from './ManageChecklistItem.vue'

export default {
    name: 'checklist',
    data () {
      return {
        isEditable: false,
        inputIcon: 'fa-times',
        unsavedChanges: false,
        selectingCheckedFilter: false,
        selectingPriorityFilter: false
      }
    },
    components: {
        ChecklistItems,
        Breadcrumbs,
        AddItem,
        ManageChecklistItem
    },
    computed: {
      ...mapGetters([
        'checklist',
        'currentEditableItem',
        'currentEditableItemIsExpanded',
        'filters'
      ]),
      checklistClass: function() {
        if (this.currentEditableItem.id && this.currentEditableItemIsExpanded) return 'has-expanded-editable-item'
        if (this.currentEditableItem.id && ! this.currentEditableItemIsExpanded) return 'has-editable-item'
        return null
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
      }
    },
    methods: {
      ...mapActions([
        'saveChecklist',
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
        this.saveChecklist(this.checklist)
        .then(
          (checklist) => {
            this.inputIcon = 'fa-times'
            this.unsavedChanges = false
          }
        )
        .catch(
          () => {
            this.inputIcon = 'fa-times'
            alert('Error saving List')
          }
        )
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
    }
}
</script>
