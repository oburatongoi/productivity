<template lang="html">
  <li
    class="listing list-color-scheme"
    :class="{selected: selected.checklists.indexOf(checklist) !== -1 }"
    draggable="true"
    @click="toggleSelection({model:'checklist', listing: checklist})"
    @dblclick="goToListing('list', checklist.fake_id)"
    v-tooltip.bottom-left="checklist.title"
  >
      <h5>
        <i class="fa fa-fw fa-list" aria-hidden="true"></i>
        {{checklist.title}}
      </h5>

      <a :href="'/lists/' + checklist.fake_id"
          class="go-to-listing"
          v-if="selected.checklists.indexOf(checklist) !== -1"
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
      'clearSelected',
      'deselectListing',
      'selectListing'
    ]),
    goToListing: function(model, id) {
      return window.location = '/' + model + 's/' + id
    },
    toggleSelection: function(payload) {
      return this.selected.checklists.indexOf(payload.listing) !== -1 ? this.deselectListing(payload) : this.selectListing(payload)
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
