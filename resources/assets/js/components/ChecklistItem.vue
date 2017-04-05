<template>
  <!-- <div v-if="itemIsVisible">
      <show-item :item="item"></show-item>
  </div> -->
  <div v-if="itemIsVisible" class="show-item" :class="{'is-selected':itemIsCurrentlyEditable}" @click.self="edit">

    <div class="pretty inline outline-success plain smooth" @click="checkItem">
      <input type="checkbox" :checked="item.checked_at"/>
      <label><i class="fa" :class="checkboxClass"></i></label>
    </div>

    <p class="show-item-content" @click="edit">{{ item.content }}</p>

    <i class="fa fa-fw fa-angle-down toggle" aria-hidden="true" @click="edit"></i>

    <p class="preview-deadline" @click="edit">
      <span v-if="item.is_important">
        <i class="fa fa-fw fa-star" aria-hidden="true"></i>
      </span>

      <span v-if="item.is_urgent">
        <i class="fa fa-fw fa-clock-o" aria-hidden="true"></i>
      </span>

      <span v-if="item.comments">
        <i class="fa fa-fw fa-comment-o" aria-hidden="true"></i>
      </span>

      <span v-if="deadlinePlaceholder">
          {{ deadlinePlaceholder }}
      </span>
    </p>

  </div>
</template>

<script>

import { mapActions, mapGetters } from 'vuex'

import ShowItem from './ShowItem.vue'

export default {
    name: 'checklist-item',
    props: ['item'],
    data () {
      return {
          checkboxClass: 'fa-check'
      }
    },
    methods: {
      ...mapActions([
        // 'check',
        'setEditability',
        'saveCurrentEditableItem'
      ]),
      checkItem: function() {
        this.checkboxClass = 'fa-spinner fa-spin'
        if (this.item.checked_at) {
          this.item.checked_at = null
        } else {
          this.currentEditableItem.checked_at = moment().format()
        }
        this.saveCurrentEditableItem(this.item)
            .then(
              () => {this.checkboxClass = 'fa-check'}
            )
            .catch(
              () => {this.checkboxClass = 'fa-check'}
            )
      },
      edit: function() {
        return this.setEditability({editable: true, item:this.item })
      }
    },
    computed: {
      ...mapGetters([
        'unfilteredItems',
        'editableItems',
        'currentEditableItem',
        'deletedItems',
        'filters'
      ]),
      itemIsUnfiltered: function() {
        return this.unfilteredItems.indexOf(this.item.id) !== -1
      },
      itemIsDeleted: function() {
        return this.deletedItems.indexOf(this.item.id) !== -1
      },
      itemPassesCheckedFilter: function() {
        if (this.filters.checked == 'all') {
          return true
        }
        if (this.filters.checked == 'checked') {
          if (this.item.checked_at && this.item.checked_at !== null) {
            return true
          }
          return false
        }
        if (this.filters.checked == 'unchecked') {
          if (!this.item.checked_at || this.item.checked_at == null) {
            return true
          }
          return false
        }
        return true
      },
      itemPassesPriorityFilter: function() {
        if (this.filters.priority == 'none') {
          return true
        }
        if (this.filters.priority == 'both') {
          if (this.item.is_important && this.item.is_urgent) {
            return true
          }
          return false
        }
        if (this.filters.priority == 'important') {
          if (this.item.is_important && ! this.item.is_urgent) {
            return true
          }
          return false
        }
        if (this.filters.priority == 'urgent') {
          if (this.item.is_urgent && ! this.item.is_important) {
            return true
          }
          return false
        }
        return true
      },
      itemIsVisible: function() {
        return this.itemIsUnfiltered || !this.itemIsDeleted && this.itemPassesCheckedFilter && this.itemPassesPriorityFilter
      },
      itemIsCurrentlyEditable: function() {
        return this.item.id == this.currentEditableItem.id
      },
      deadlinePlaceholder: function () {
        return this.item.deadline ? moment(this.item.deadline).format('MMM DD') : undefined
      }
    },
    components: {
        ShowItem
    }
}
</script>
