<template lang="html">
  <li
    class="listing list-color-scheme"
    :class="{selected: selected.id==checklist.fake_id&&selected.model=='checklist'}"
    draggable="true"
    @click="selectListing({model:'checklist', id:checklist.fake_id, listing: checklist})"
    @dblclick="goToListing('list', checklist.fake_id)"
    v-tooltip.bottom-left="checklist.title"
  >
      <h5>
        <i class="fa fa-fw fa-list" aria-hidden="true"></i>
        {{checklist.title}}
      </h5>

      <a :href="'/lists/' + checklist.fake_id"
          class="go-to-listing"
          v-if="selected.id==checklist.fake_id&&selected.model=='checklist'"
      >
        <i class="fa fa-angle-double-right" aria-hidden="true"></i>
      </a>
      <span class="item-count-tag" v-if="checklist.list_type=='ta'&&checklist.items_count">
        <span class="item-count">{{checklist.items_count}}</span>
      </span>
  </li>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'index-checklists',
  props: {
    checklist: Object
  },
  methods: {
    ...mapActions([
      'selectListing'
    ]),
    goToListing: function(model, id) {
      return window.location = '/' + model + 's/' + id
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
