<template lang="html">
  <ul class="productivity-notices" v-if="notices&&notices.length">
    <notice v-for="notice in notices"
            :notice="notice"
            :key="getKey()"
    ></notice>
  </ul>
</template>

<script>
import { mapGetters } from 'vuex'
import Notice from './Notice.vue'

export default {
  name: 'notices',
  methods: {
    getKey: function() {
      return _.uniqueId()
    }
  },
  computed: {
    ...mapGetters([
      'notices'
    ])
  },
  components: {
    Notice
  }
}
</script>

<style lang="css">
  .productivity-notices {
    position: absolute;
    top: 20px;
    right: 20px;
    width: 40%;
    z-index: 9999999999999999;
    background: transparent;
  }
  .productivity-notices:after {
      display: inline-block;
      content:"";
      clear:both;
  }
</style>
