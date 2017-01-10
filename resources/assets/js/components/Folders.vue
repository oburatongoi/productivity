<template lang="html">
  <div>
      <ul>
          <li v-if="folders" v-for="folder in folders">
              <folder :folder="folder"></folder>
          </li>
      </ul>
  </div>
</template>

<script>
import Folder from './Folder.vue'
export default {
    name: 'folders-index',
    props: ['folders'],
    components: {
        Folder
    }
}
</script>
