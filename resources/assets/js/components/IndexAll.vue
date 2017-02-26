<template lang="html">
  <div class="index-all" @click.self="deselectListing">
    <div class="index-folders">
      <h5 v-if="hasFolders">Folders</h5>
      <ul class="list-unstyled" @click.self="deselectListing">
          <li
            v-if="folders"
            v-for="folder in folders"
            class="listing folder-color-scheme"
            :class="{selected: selected.id==folder.fake_id&&selected.model=='folder'}"
            draggable="true"
            @click="selectListing({model: 'folder', id: folder.fake_id, listing: folder})"
            @dblclick.prevent="goToListing('folder', folder.fake_id)"
            v-tooltip.bottom-left="folder.name"
          >
              <h5>
                <i class="fa fa-fw fa-folder" aria-hidden="true"></i>
                {{folder.name}}
              </h5>

              <a :href="'/productivity/folders/' + folder.fake_id"
                  class="go-to-listing"
                  v-if="selected.id==folder.fake_id&&selected.model=='folder'"
              >
                <i class="fa fa-angle-right" aria-hidden="true"></i>
              </a>
          </li>
      </ul>
    </div>

    <div class="index-files">
      <h5 v-if="hasFiles">Files</h5>
      <ul class="list-unstyled" @click.self="deselectListing">
        <li
          v-if="checklists"
          v-for="checklist in checklists"
          class="listing list-color-scheme"
          :class="{selected: selected.id==checklist.fake_id&&selected.model=='checklist'}"
          draggable="true"
          @click="selectListing({model:'checklist', id:checklist.fake_id, listing: checklist})"
          @dblclick.prevent="goToListing('list', checklist.fake_id)"
          v-tooltip.bottom-left="checklist.title"
        >
            <h5>
              <i class="fa fa-fw fa-list" aria-hidden="true"></i>
              {{checklist.title}}
            </h5>

            <a :href="'/productivity/lists/' + checklist.fake_id"
                class="go-to-listing"
                v-if="selected.id==checklist.fake_id&&selected.model=='checklist'"
            >
              <i class="fa fa-angle-right" aria-hidden="true"></i>
            </a>
        </li>

        <!-- <li
          v-if="notes"
          v-for="note in notes"
          class="listing note-color-scheme"
          :class="{selected: selected.id==note.fake_id&&selected.model=='note'}"
          draggable="true"
          @click="selectListing({model:'note', id:note.fake_id, listing: note})"
          @dblclick.prevent="goToListing('note', note.fake_id)"
          v-tooltip.bottom-left="note.title"
        >
            <h5>
              <i class="fa fa-fw fa-sticky-note" aria-hidden="true"></i>
              {{note.title}}
            </h5>
            <a :href="'/productivity/lists/' + note.fake_id"
                class="go-to-listing"
                v-if="selected.id==note.fake_id&&selected.model=='note'"
            >
              <i class="fa fa-angle-right" aria-hidden="true"></i>
            </a>
        </li> -->

        <!-- <li
          v-if="goals"
          v-for="goal in goals"
          class="listing goal-color-scheme"
          :class="{selected: selected.id==goal.fake_id&&selected.model=='goal'}"
          draggable="true"
          @click="selectListing({model:'goal', id:goal.fake_id, listing: goal})"
          @dblclick.prevent="goToListing('goal', goal.fake_id)"
          v-tooltip.bottom-left="goal.title"
        >
            <h5>
              <i class="fa fa-fw fa-check-square" aria-hidden="true"></i>
              {{goal.title}}
            </h5>
            <a :href="'/productivity/lists/' + goal.fake_id"
                class="go-to-listing"
                v-if="selected.id==goal.fake_id&&selected.model=='goal'"
            >
              <i class="fa fa-angle-right" aria-hidden="true"></i>
            </a>
        </li> -->
      </ul>
    </div>

    <p class="notice" v-if="isEmpty">No Files or Folders have been added yet.</p>

    <move-to-folder v-if="selected.model&&selected.id&&selected.movable"></move-to-folder>
  </div>
</template>

<script>
import MoveToFolder from './MoveToFolder.vue'

import { mapActions, mapGetters } from 'vuex'

var bus = new Vue()

export default {
  name: 'index-all',
  methods: {
    ...mapActions([
      'selectListing',
      'deselectListing',
      'toggleMovable'
    ]),
    goToListing: function(model, id) {
      return window.location = '/productivity/' + model + 's/' + id
    }
  },
  computed: {
    ...mapGetters([
      'user',
      'folders',
      'checklists',
      'notes',
      'goals',
      'creatingNew',
      'currentFolder',
      'selected'
    ]),
    hasFolders: function() {
      return this.folders.length
    },
    hasFiles: function() {
      // return this.checklists.length || this.notes.length || this.goals.length
      return this.checklists.length
    },
    isEmpty: function() {
      return ! this.hasFolders && ! this.hasFiles
    }
  },
  components: {
    MoveToFolder
  },
}
</script>
