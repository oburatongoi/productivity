<template lang="html">
  <div>
    <action-nav></action-nav>
    <index-all></index-all>
  </div>
</template>

<script>

import IndexAll from './IndexAll.vue'
import ActionNav from './ActionNav.vue'

export default {
  name: 'folders',
  components: {
    IndexAll,
    ActionNav
  },
}
</script>
