<template lang="html">
  <div>
      <create-new></create-new>
      <h5>Folders</h5>
      <ul class="list-unstyled">
          <li
            v-if="folders"
            v-for="folder in folders"
            class="listing folder-color-scheme"
            :class="{selected: selectedId==folder.id&&selectedModel=='folder'}"
            draggable="true"
            @click.prevent="selectListing('folder', folder.id)"
            @dblclick.prevent="goToListing('folder', folder.id)"
          >
              <i class="fa fa-fw fa-folder" aria-hidden="true"></i>
              <h5>{{folder.name}}</h5>
          </li>
      </ul>

      <h5>Files</h5>
      <ul class="list-unstyled">
        <li
          v-if="checklists"
          v-for="checklist in checklists"
          class="listing list-color-scheme"
          :class="{selected: selectedId==checklist.id&&selectedModel=='checklist'}"
          draggable="true"
          @click.prevent="selectListing('checklist', checklist.id)"
          @dblclick.prevent="goToListing('checklist', checklist.id)"
        >
            <i class="fa fa-fw fa-list" aria-hidden="true"></i>
            <h5>{{checklist.title}}</h5>
        </li>

        <li
          v-if="notes"
          v-for="note in notes"
          class="listing note-color-scheme"
          :class="{selected: selectedId==note.id&&selectedModel=='note'}"
          draggable="true"
          @click.prevent="selectListing('note', note.id)"
          @dblclick.prevent="goToListing('note', note.id)"
        >
            <i class="fa fa-fw fa-sticky-note" aria-hidden="true"></i>
            <h5>{{note.title}}</h5>
        </li>

        <li
          v-if="goals"
          v-for="goal in goals"
          class="listing goal-color-scheme"
          :class="{selected: selectedId==goal.id&&selectedModel=='goal'}"
          draggable="true"
          @click.prevent="selectListing('goal', goal.id)"
          @dblclick.prevent="goToListing('goal', goal.id)"
        >
            <i class="fa fa-fw fa-check-square" aria-hidden="true"></i>
            <h5>{{goal.name}}</h5>
        </li>
      </ul>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

var bus = new Vue()

import CreateNew from './CreateNew.vue'

export default {
  name: 'folders',
  data () {
    return {
      selectedId: undefined,
      selectedModel: undefined
    }
  },
  components: {
    CreateNew,
  },
  methods: {
    ...mapActions([

    ]),
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
      // 'goals',
      'creatingFolder',
      'creatingNew',
      'currentFolder'
    ])
  }
}
</script>
