<template lang="html">
  <form class="add-item-lite" @submit.prevent="submitForm">
    <label :for="parent.model+parent.id" class="add-item-lite-icon">
      <i class="fa fa-fw fa-plus" aria-hidden="true"/>
    </label>
    <input type="text" :id="parent.model+parent.id" v-model="item.content" placeholder="New Item" v-focus>
    <i class="fa fa-fw fa-times cancel-add-item-lite-icon" aria-hidden="true" v-if="item.content" @click="reset"/>
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
    context: {
      type: String,
      default: 'checklist'
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
  methods: {
    ...mapActions([
      'addChecklistItem',
      'addSubChecklistItem',
      'addToKanbanArray',
    ]),
    reset: function() {
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
        return this.addChecklistItem( {item: this.item, parent: this.parent} )
                            .then( (newItem) => {
                              let array = this.context == 'descendants.items' ? this.parent.descendants.items : this.parent['items']
                              this.addToKanbanArray( { array, value: newItem } )
                              this.reset()
                            })
                            .catch( () => console.log('Error has occured') )
          break;
        case 'checklist-item':
          return this.addSubChecklistItem( {item: this.item, parent: this.parent} )
                     .then( (newItem) => {
                       let array = this.context == 'descendants.items' ? this.parent.descendants.items : this.parent['sub_items']
                        this.addToKanbanArray( { array , value: newItem } )
                        this.reset()
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
    // background: pink;
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
