<template lang="html">
  <div class="action-nav">
      <create-new></create-new>
      <button type="button" class="btn btn-primary btn-sm toggle-move-btn" v-if="selected.model&&selected.id&&!selected.movable" @click.prevent="toggleMovable">Move</button>
  </div>
</template>

<script>
import CreateNew from './CreateNew.vue'
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'action-nav',
  methods: {
    ...mapActions([
      'toggleMovable'
    ])
  },
  computed: {
    ...mapGetters([
      'selected'
    ])
  },
  components: {
    CreateNew
  }
}
</script>

<style lang="css">
</style>
