<template lang="html">
  <form class="add-item-lite" @submit.prevent="submitForm" autocomplete="off">
    <label :for="parent.model+'-'+parent.id+'-add-item-lite'" class="add-item-lite-icon" :class="{ 'ol-number-icon-container': listType=='nu' }">
      <span
      class="ol-number-icon"
      v-if="listType=='nu'" >
        {{ addItemLiteInputIcon }}.
      </span>

      <i class="fa fa-fw" :class="addItemLiteInputIcon" aria-hidden="true" v-else/>
    </label>
    <input type="text" :id="parent.model+'-'+parent.id+'-add-item-lite'" :class="{ 'ol-number-input':listType=='nu' }" v-model="item.content" placeholder="New Item">
    <i class="fa fa-fw cancel-add-item-lite-icon" :class="addItemLiteCancelIcon" aria-hidden="true" v-if="item.content" @click="resetAddItemLite"/>
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
      item: undefined,
    }
  },
  computed: {
    addItemLiteInputIcon: function() {
      return  this.listType=='bu' ? 'fa-circle' :
              this.listType=='nu' ? this.parent.items.length + 1 || this.parent.sub_items.length + 1 :
              this.listType == 'ch' || this.listType == 'ta' ? this.isSubItem ? 'fa-square-o' : 'fa-circle-thin' : 'fa-plus'
    },
    addItemLiteCancelIcon: function() {
      return this.isSaving ? 'fa-circle-o-notch fa-spin' : 'fa-times'
    },
    listType: function() {
      return this.parent.list_type || this.parent.sub_list_type
    }
  },
  created: function() {
    this.resetAddItemLite()
  },
  methods: {
    ...mapActions([
      'storeChecklistItem',
      'storeSubChecklistItem',
      'addToKanbanArray',
    ]),
    resetAddItemLite: function() {
      this.item = {
          content: null,
          sort_order: undefined,
          isNewItem: true,
      }
      this.setSortOrder()
      this.isSaving = false
    },
    setSortOrder: function() {
      switch (this.parent.model) {
        case 'checklist-item':
          this.item.sort_order = this.parent.sub_items ? this.parent.sub_items.length : 0
          break;
        case 'checklist':
          this.item.sort_order = this.parent.items ? this.parent.items.length : 0
          break;
      }
    },
    submitForm: function() {
      if (!this.item.content) return
      this.isSaving = true
      switch (this.parent.model) {
        case 'checklist':
          if (!this.parent.items) this.$set(this.parent, 'items', [])
          if (this.parent.infoMessage) this.$set(this.parent, 'infoMessage', null)
          return this.storeChecklistItem( {item: this.item, parent: this.parent} )
                     .then( (newItem) => {
                       this.addToKanbanArray( { array: this.parent.items, value: newItem } )
                       this.resetAddItemLite()
                     })
                     .catch( () => console.log('Error has occured') )
          break;
        case 'checklist-item':
          if (!this.parent.sub_items) this.$set(this.parent, 'sub_items', [])
          if (this.parent.infoMessage) this.$set(this.parent, 'infoMessage', null)
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
    padding: 5px 15px 5px 28px;
    width: 100%;
    border: 0;
    outline: none;

    &.ol-number-input {
      padding: 5px 5px 5px 35px;
    }

    &::-webkit-input-placeholder { /* Chrome/Opera/Safari */
      color: lighten($base-border-color, 4%) !important;
    }
    &::-moz-placeholder { /* Firefox 19+ */
      color: lighten($base-border-color, 4%) !important;
    }
    &:-ms-input-placeholder { /* IE 10+ */
      color: lighten($base-border-color, 4%) !important;
    }
    &:-moz-placeholder { /* Firefox 18- */
      color: lighten($base-border-color, 4%) !important;
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
    left: 5px;

    // &:not(.ol-number-icon-container) {
    //   font-size: 0.7em;
    // }
    .fa-circle {
      font-size: 0.7em;
    }

    &.ol-number-icon-container {
      top: 5px;
    }
  }

  .cancel-add-item-lite-icon {
    right: 5px;
    background: rgba(255,255,255,0.5);
    padding: 5px;
    font-size: 0.8em;
  }

  span.ol-number-icon {
    font-size: 1em;
    font-weight: bold;
    padding: 0 0 0 5px;
    color: $base-border-color;
  }
}
</style>
