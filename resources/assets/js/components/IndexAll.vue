<template lang="html">
  <div>
      <h5 v-if="hasFolders">Folders</h5>
      <ul class="list-unstyled">
          <li
            v-if="folders"
            v-for="folder in folders"
            class="listing folder-color-scheme"
            :class="{selected: selectedId==folder.fake_id&&selectedModel=='folder'}"
            draggable="true"
            @click.prevent="selectListing('folder', folder.fake_id)"
            @dblclick.prevent="goToListing('folder', folder.fake_id)"
          >
              <i class="fa fa-fw fa-folder" aria-hidden="true"></i>
              <h5>{{folder.name}}</h5>
          </li>
      </ul>

      <h5 v-if="hasFiles">Files</h5>
      <ul class="list-unstyled">
        <li
          v-if="checklists"
          v-for="checklist in checklists"
          class="listing list-color-scheme"
          :class="{selected: selectedId==checklist.fake_id&&selectedModel=='checklist'}"
          draggable="true"
          @click.prevent="selectListing('checklist', checklist.fake_id)"
          @dblclick.prevent="goToListing('list', checklist.fake_id)"
        >
            <i class="fa fa-fw fa-list" aria-hidden="true"></i>
            <h5>{{checklist.title}}</h5>
        </li>

        <li
          v-if="notes"
          v-for="note in notes"
          class="listing note-color-scheme"
          :class="{selected: selectedId==note.fake_id&&selectedModel=='note'}"
          draggable="true"
          @click.prevent="selectListing('note', note.fake_id)"
          @dblclick.prevent="goToListing('note', note.fake_id)"
        >
            <i class="fa fa-fw fa-sticky-note" aria-hidden="true"></i>
            <h5>{{note.title}}</h5>
        </li>

        <li
          v-if="goals"
          v-for="goal in goals"
          class="listing goal-color-scheme"
          :class="{selected: selectedId==goal.fake_id&&selectedModel=='goal'}"
          draggable="true"
          @click.prevent="selectListing('goal', goal.fake_id)"
          @dblclick.prevent="goToListing('goal', goal.fake_id)"
        >
            <i class="fa fa-fw fa-check-square" aria-hidden="true"></i>
            <h5>{{goal.name}}</h5>
        </li>
      </ul>

      <p class="notice" v-if="isEmpty">No Files or Folders have been added yet.</p>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

var bus = new Vue()

export default {
  name: 'index-all',
  data () {
    return {
      selectedId: undefined,
      selectedModel: undefined
    }
  },
  methods: {
    selectListing: function(model, id) {
      this.selectedModel = model
      return this.selectedId = id
    },
    goToListing: function(model, id) {
      return window.location = '/productivity/' + model + 's/' + id
    },
  },
  computed: {
    ...mapGetters([
      'user',
      'folders',
      'checklists',
      'notes',
      'goals',
      'creatingNew',
      'currentFolder'
    ]),
    hasFolders: function() {
      return this.folders.length
    },
    hasFiles: function() {
      return this.checklists.length || this.notes.length || this.goals.length
    },
    isEmpty: function() {
      return ! this.hasFolders && ! this.hasFiles
    }
  }
}
</script>
