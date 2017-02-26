<template>
  <div class="panel">
    <div class="panel-heading">
        <h3>
          <i class="fa fa-fw fa-list" :class="{'list-color-scheme':isEditable}" aria-hidden="true"></i>
          <span v-if="!isEditable" @click="toggleEditability">{{checklist.title}}</span>
          <input type="text" class="edit-checklist-input" ref="titleinput" v-model="localChecklist.title" v-if="isEditable" @keyup.enter.prevent="save">
          <i class="fa fa-fw fa-times edit-checklist-icon" aria-hidden="true" v-if="isEditable" @click="toggleEditability"></i>
        </h3>
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
        localChecklist: {},
        isEditable: false
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
      ])
    },
    methods: {
      ...mapActions([
        'saveChecklist'
      ]),
      save: function() {
        this.saveChecklist(this.localChecklist).then(
          () => this.toggleEditability(),
          () => { alert('Error saving List') }
        )
      },
      initializeChecklist: function(){
        this.localChecklist.title = this.checklist.title
        this.localChecklist.id = this.checklist.id
        this.localChecklist.fake_id = this.checklist.fake_id
      },
      toggleEditability: function() {
        this.isEditable = ! this.isEditable
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
      this.initializeChecklist()
    }
}
</script>
