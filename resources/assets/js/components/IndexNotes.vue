<template lang="html">
  <li
    class="listing note-color-scheme"
    :class="{selected: selected.id==note.fake_id&&selected.model=='note'}"
    draggable="true"
    @click="selectListing({model:'note', id:note.fake_id, listing: note})"
    @dblclick="goToListing('note', note.fake_id)"
    v-tooltip.bottom-left="note.title"
  >
      <h5>
        <i class="fa fa-fw fa-sticky-note" aria-hidden="true"></i>
        {{note.title}}
      </h5>
      <a :href="'/productivity/lists/' + note.fake_id"
          class="go-to-listing"
          v-if="selected.id==note.fake_id&&selected.model=='note'"
      >
        <i class="fa fa-angle-double-right" aria-hidden="true"></i>
      </a>
  </li>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'index-notes',
  props: {
    note: Object
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
