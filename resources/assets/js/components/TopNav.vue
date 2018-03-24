<template lang="html">
  <div class="top-nav-wrap">
    
    <breadcrumbs :current-view="currentView"/>

    <action-nav v-if="listingIsActionable"/>

  </div>
</template>

<script>
// import { mapActions, mapGetters } from 'vuex'
import { mapGetters } from 'vuex'

import Breadcrumbs from './Breadcrumbs.vue'
import ActionNav from './ActionNav.vue'

export default {
  name: 'top-nav',
  components: {
    Breadcrumbs,
    ActionNav
  },
  props: {
    currentView: {
      type: String,
      default: null
    }
  },
  computed: {
    ...mapGetters([
      // 'showCreatingNewButtons',
      // 'creatingNew',
      'listingIsActionable'
    ])
  },
  // methods: {
  //   ...mapActions([
  //     'toggleCreatingNewButtons'
  //   ])
  // },

}
</script>

<style lang="scss">
.top-nav {
    @include main-nav;
    // padding-right: 1.7vw;
    // padding-left: 1.7vw;
    padding-right: 20px;
    padding-left: 20px;
    padding-top: 4px;
    padding-bottom: 4px;
    height: inherit;
    .top-nav-wrap {
        margin:0;
        padding:0;
        height:100%;
    }
    position: relative;
}

.toggle-create-new-btn {
    margin: 0;
    margin-right: 10px;
    color: white;
    vertical-align: middle;
    border-radius: 50% !important;
    height: 27px;
    width: 27px;
    padding: 0;

    &:active {
      outline: none;
    }
}
</style>
