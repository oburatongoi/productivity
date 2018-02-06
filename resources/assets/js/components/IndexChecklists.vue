<template lang="html">
  <li
    class="listing list-color-scheme"
    :class="{selected: selected.checklists.indexOf(checklist) !== -1 }"
    draggable="true"
    @click="toggleSelection({selection: {model:'checklist', listing: checklist}, event: $event})"
    @dblclick="goToListing('list', checklist.fake_id)"
    :id="'checklist-'+checklist.fake_id"
    v-tooltip.bottom-start="{ content: checklist.title, classes: 'checklist', trigger: 'hover', autoHide: false, container: '#checklist-'+checklist.fake_id }"
  >
      <h5>
        <i class="fa fa-fw" :class="checklistIconClass" aria-hidden="true"/>
        {{ checklist.title }}
      </h5>

      <a :href="'/lists/' + checklist.fake_id"
          class="go-to-listing"
          v-if="selected.checklists.indexOf(checklist) !== -1"
      >
        <i class="fa fa-angle-double-right" aria-hidden="true"/>
      </a>
      <span class="item-count-tag" v-if="checklist.list_type=='ta'&&checklist.items_count">
        <span class="item-count">{{ checklist.items_count }}</span>
      </span>
  </li>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'index-checklists',
  props: {
    checklist: {
      type: Object,
      required: true
    }
  },
  computed: {
    ...mapGetters([
      'selected'
    ]),
    checklistIconClass: function() {
    return ! this.checklist.list_type         ? 'fa-list'         :
             this.checklist.list_type == 'ch' ? 'fa-list'         :
             this.checklist.list_type == 'ta' ? 'fa-check-square' :
             this.checklist.list_type == 'bu' ? 'fa-list-ul'      :
             this.checklist.list_type == 'nu' ? 'fa-list-ol'      :
                                                'fa-list'         ;
    },
  },
  methods: {
    ...mapActions([
      'toggleSelection'
    ]),
    goToListing: function(model, id) {
      return window.location = '/' + model + 's/' + id
    },
    isSelected: function(listing) {
      return this.selected.checklists.indexOf(listing) !== -1
    }
  },
}
</script>

<style lang="css">
</style>
