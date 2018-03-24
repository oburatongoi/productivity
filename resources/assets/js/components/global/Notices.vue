<template lang="html">
  <ul class="productivity-notices" v-if="notices&&notices.length">
    <notice v-for="notice in notices"
            :notice="notice"
            :key="notice.id"
    />
  </ul>
</template>

<script>
import { mapGetters } from 'vuex'
import Notice from './Notice.vue'

export default {
  name: 'notices',
  components: {
    Notice
  },
  computed: {
    ...mapGetters([
      'notices'
    ])
  },
}
</script>

<style lang="scss">
  .productivity-notices {
    position: absolute;
    top: 20px;
    right: 20px;
    width: 40%;
    @include high-z-index(2);
    background: transparent;
  }
  .productivity-notices:after {
      display: inline-block;
      content:"";
      clear:both;
  }
</style>
