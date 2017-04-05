<template>
  <div class="checklist" :class="checklistClass">
    <div class="panel main-panel">
      <div class="panel-heading">
          <h4>
            <i class="fa fa-fw fa-list" :class="{'list-color-scheme':isEditable}" aria-hidden="true"></i>
            <span v-if="!isEditable" @click="toggleEditability(true)">{{localChecklist.title}}</span>
            <input type="text" class="edit-checklist-input" ref="titleinput" v-model="checklist.title" v-if="isEditable" @keyup.enter.prevent="save" @keyup="checkForChanges" @change="checkForChanges">
            <i class="fa fa-fw fa-times edit-checklist-icon" aria-hidden="true" v-if="isEditable" @click="cancelChanges"></i>
            <button type="button" class="btn btn-list btn-xs edit-checklist-btn" v-if="unsavedChanges" @click.prevent="save">
              Save
              <i class="fa fa-spinner fa-spin" aria-hidden="true"v-if="loading"></i>
            </button>
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
                    All
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
        localChecklist: {
          title: undefined
        },
        isEditable: false,
        loading: false,
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
      cancelChanges: function() {
        this.checklist.title = this.localChecklist.title
        this.toggleEditability(false)
      },
      checkForChanges: _.debounce(
        function() {
          console.log('checking for changes...');
          let stringsMatch = this.checklist.title === this.localChecklist.title;
          if (!stringsMatch) {
            console.log('There are unsaved changes...');
          }
          return this.unsavedChanges = ! stringsMatch
        },
        300
      ),
      save: function() {
        this.loading = true
        this.saveChecklist(this.checklist)
        .then(
          (checklist) => {
            this.toggleEditability(false)
            this.loading = this.unsavedChanges = false
            this.checklist = checklist
            this.syncChecklist()
          }
        )
        .catch(
          () => {
            this.loading = false
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
      syncChecklist: function(){
        this.localChecklist.title = this.checklist.title
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

        if (this.isEditable) {
          this.$nextTick(function(){
            this.focusOnInput()
          })
        }

      },
      focusOnInput: function() {
        this.$refs.titleinput.focus()
      }
    },
    created: function() {
      this.syncChecklist()
    }
}
</script>
