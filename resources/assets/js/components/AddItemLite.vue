<template lang="html">
  <form class="add-item-lite" @submit.prevent="submitForm">
    <label :for="parent.model+'-'+parent.id+'-add-item-lite'" class="add-item-lite-icon">
      <i class="fa fa-fw fa-plus" aria-hidden="true"/>
    </label>
    <input type="text" :id="parent.model+'-'+parent.id+'-add-item-lite'" v-model="item.content" placeholder="New Item">
    <i class="fa fa-fw cancel-add-item-lite-icon" :class="addItemLiteInputIcon" aria-hidden="true" v-if="item.content" @click="resetAddItemLite"/>
  </form>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  name: 'add-item-lite',
  props: {
    parent: {
      type: Object,
      required: true
    },
  },
  data () {
    return {
      isSaving: false,
      item: {
        content: null,
        sort_order: undefined,
        isNewItem: true,
      },
    }
  },
  computed: {
    addItemLiteInputIcon: function() {
      return this.isSaving ? 'fa-circle-o-notch fa-spin' : 'fa-times'
    }
  },
  methods: {
    ...mapActions([
      'storeChecklistItem',
      'storeSubChecklistItem',
      'addToKanbanArray',
    ]),
    resetAddItemLite: function() {
      this.isSaving = false
      this.item = {
          content: null,
          sort_order: undefined,
          isNewItem: true,
      }
    },
    submitForm: function() {
      if (!this.item.content) return
      this.isSaving = true
      switch (this.parent.model) {
        case 'checklist':
          if (!this.parent.items) this.$set(this.parent, 'items', [])
          return this.storeChecklistItem( {item: this.item, parent: this.parent} )
                     .then( (newItem) => {
                       this.addToKanbanArray( { array: this.parent.items, value: newItem } )
                       this.resetAddItemLite()
                     })
                     .catch( () => console.log('Error has occured') )
          break;
        case 'checklist-item':
          if (!this.parent.sub_items) this.$set(this.parent, 'sub_items', [])
          return this.storeSubChecklistItem( {item: this.item, parent: this.parent} )
                     .then( (newItem) => {

                       this.addToKanbanArray( { array: this.parent.sub_items , value: newItem } )
                       this.resetAddItemLite()
                      })
                     .catch( () => console.log('Error has occured') )
          break;
        default: return
      }
    },
  },
}
</script>

<style lang="scss">
.add-item-lite {
  display: block;
  position: relative;

  input {
    padding: 5px 5px 5px 20px;
    width: 100%;
    border: 0;
    outline: none;

    &::-webkit-input-placeholder { /* Chrome/Opera/Safari */
      color: darken($base-border-color, 7%) !important;
    }
    &::-moz-placeholder { /* Firefox 19+ */
      color: darken($base-border-color, 7%) !important;
    }
    &:-ms-input-placeholder { /* IE 10+ */
      color: darken($base-border-color, 7%) !important;
    }
    &:-moz-placeholder { /* Firefox 18- */
      color: darken($base-border-color, 7%) !important;
    }
  }

  .cancel-add-item-lite-icon,
  .add-item-lite-icon {
    position: absolute;
    top: 5px;
    color: $base-border-color;
    cursor: pointer;
  }
  .add-item-lite-icon {
    left: 0;
  }
  .cancel-add-item-lite-icon {
    right: 5px;
    background: rgba(255,255,255,0.5);
    padding: 5px;
  }
}
</style>
