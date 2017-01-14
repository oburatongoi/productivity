<template lang="html">
  <div>
      <div class="form-group">
          <button type="button" class="btn btn-sm btn-primary" v-if="!creatingFolder" @click="toggleCreatingFolder">New</button>
      </div>

      <folders-create
        v-if="creatingFolder"
        v-on:cancel="toggleCreatingFolder"
        v-on:create="createFolder"
      ></folders-create>

      <ul class="list-unstyled">
          <li v-if="folders" v-for="folder in folders">
              <folder :folder="folder"></folder>
          </li>
      </ul>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

var bus = new Vue()

import Folder from './Folder.vue'
import FoldersCreate from './FoldersCreate.vue'

export default {
  name: 'folders-index',
  props: ['folders'],
  components: {
    Folder,
    FoldersCreate,
  },
  methods: {
    ...mapActions([
      'storeFolder',
    ]),
    toggleCreatingFolder: function() {
        return this.creatingFolder = !this.creatingFolder
    },
    createFolder: function(name) {
        alert(name)
    }
  },
  computed: {
    ...mapGetters([
      user,
      folders,
      creatingFolder,
      currentFolder
    ])
  }
}
</script>
