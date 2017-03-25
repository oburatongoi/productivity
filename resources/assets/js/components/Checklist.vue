<template>
  <div class="panel">
    <div class="panel-heading">
        <h3>
          <i class="fa fa-fw fa-list" :class="{'list-color-scheme':isEditable}" aria-hidden="true"></i>
          <span v-if="!isEditable" @click="toggleEditability(true)">{{localChecklist.title}}</span>
          <input type="text" class="edit-checklist-input" ref="titleinput" v-model="checklist.title" v-if="isEditable" @keyup.enter.prevent="save" @keyup="checkForChanges" @change="checkForChanges">
          <i class="fa fa-fw fa-times edit-checklist-icon" aria-hidden="true" v-if="isEditable" @click="toggleEditability(false)"></i>
        </h3>
        <div class="form-group" v-if="unsavedChanges">
          <button type="button" class="btn btn-list btn-xs" @click.prevent="save">
            Save
            <i class="fa fa-spinner fa-spin" aria-hidden="true"v-if="loading"></i>
          </button>
        </div>
    </div>

    <div class="panel-body">
        <add-item></add-item>
        <checklist-items></checklist-items>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

import ChecklistItems from './ChecklistItems.vue'
import Breadcrumbs from './Breadcrumbs.vue'
import AddItem from './AddItem.vue'

export default {
    name: 'checklist',
    data () {
      return {
        localChecklist: {
          title: undefined
        },
        isEditable: false,
        loading: false,
        unsavedChanges: false
      }
    },
    components: {
        ChecklistItems,
        Breadcrumbs,
        AddItem
    },
    computed: {
      ...mapGetters([
        'checklist'
      ]),
    },
    methods: {
      ...mapActions([
        'saveChecklist'
      ]),
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
      syncChecklist: function(){
        this.localChecklist.title = this.checklist.title
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
