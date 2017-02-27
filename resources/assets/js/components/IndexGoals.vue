<template lang="html">
  <li
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
        <i class="fa fa-angle-double-right" aria-hidden="true"></i>
      </a>
  </li>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'index-goals',
  props: {
    goal: Object
  },
  methods: {
    ...mapActions([
      'selectListing'
    ]),
    goToListing: function(model, id) {
      return window.location = '/productivity/' + model + 's/' + id
    }
  },
  computed: {
    ...mapGetters([
      'selected'
    ])
  },
}
</script>

<style lang="css">
</style>
