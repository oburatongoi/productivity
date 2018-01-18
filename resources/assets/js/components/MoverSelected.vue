<template lang="html">
  <div class="mover-selected">
    <template v-if="selected.checklistItems&&selected.checklistItems.length">
      <h5>Move: </h5>
      <span v-for="item in selected.checklistItems" :key="item.id">
        <i class="fa fa-fw fa-square-o" aria-hidden="true"/>
        {{ item.content | truncate(35) }}
        <i class="fa fa-fw fa-times"
          aria-hidden="true"
          v-if="selected.checklistItems.length > 1"
          @click="removeItem({ model: 'checklist-item', listing: item, preserveState: true })"
          v-tooltip.bottom="'Remove this item'"
        />
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
  // padding: 5px 10px 10px;
  padding: 5px 10px 0;
  background: $body-bg;

  h5 {
    display: inline-block;
    margin-right: 10px;
  }
  span {
    padding: 5px;
    background: white;
    color: $light-grey-text-color;
    margin-right: 10px;
    margin-bottom: 10px;
    border-radius: $base-border-radius;
    border-color: $base-border-color;
    display: inline-block;
  }
  .fa-times {
    cursor: pointer;
    &:hover {
      color: $brand-danger;
    }
  }
}
</style>
