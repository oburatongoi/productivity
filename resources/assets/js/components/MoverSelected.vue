<template lang="html">
  <div class="mover-selected">
    <template v-if="selected.checklistItems.length">
      <h6>Move the following list items: </h6>
      <span v-for="item in selected.checklistItems" :key="item.id">
        <i class="fa fa-fw fa-times"
          aria-hidden="true"
          v-if="selected.checklistItems.length > 1"
          @click="removeItem({ model: 'checklist-item', listing: item, preserveState: true })"/>
        <i class="fa fa-fw fa-square-o" aria-hidden="true"/>
        {{ item.content }}
      </span>
    </template>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'mover-selected',
  props: {
    parentModel: {
      type: String,
      required: true
    }
  },
  computed: {
    ...mapGetters([
      'editableSubItem',
      'selected',
    ]),
  },
  methods: {
    ...mapActions([
      'deselect',
      'removeCurrentlyEditable',
    ]),
    removeItem: function(payload) {
      this.deselect(payload)
          .then( () => {
            if (payload.listing.id == this.editableSubItem.id)
              this.removeCurrentlyEditable( { parentModel: this.parentModel } )
          })
          .catch( (error) => console.log(error) )
    },
  }

}
</script>

<style lang="scss">
.mover-selected {
  padding: 5px 5px 10px;
  background: $body-bg;
  margin-bottom: 20px;
  span {
    padding: 5px;
    background: white;
    color: $light-grey-text-color;
    margin-right: 5px;
    margin-bottom: 5px;
    border-radius: $base-border-radius;
    border-color: $base-border-color;
  }
}
</style>
