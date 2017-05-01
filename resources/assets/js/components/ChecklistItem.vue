<template>
  <div v-if="itemIsVisible" class="show-item" :class="{'is-selected':itemIsCurrentlyEditable}" @click.self="toggleEditability">
    <span class="checkbox-container">
      <i class="fa fa-fw" :class="checkboxClass" aria-hidden="true" @click="checkItem"></i>
    </span>

    <p class="show-item-content" @click="toggleEditability" @dblclick="toggleEditability">{{ item.content }}</p>

    <i class="fa fa-fw fa-angle-down toggle" aria-hidden="true" @click="toggleEditability" @dblclick="toggleEditability"></i>

    <p class="preview-deadline" @click="toggleEditability" @dblclick="toggleEditability">
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

export default {
    name: 'checklist-item',
    props: ['item'],
    data () {
      return {
          checkboxClassOverride: null
      }
    },
    methods: {
      ...mapActions([
        'saveCurrentEditableItem',
        'addCurrentlyEditable',
        'removeCurrentlyEditable'
      ]),
      checkItem: function() {
        this.checkboxClassOverride = 'fa-circle-o-notch fa-spin'
        if (this.item.checked_at) {
          this.item.checked_at = null
        } else {
          this.item.checked_at = moment().format()
        }
        this.saveCurrentEditableItem(this.item)
            .then(
              () => {this.checkboxClassOverride = null}
            )
            .catch(
              () => {this.checkboxClassOverride = null}
            )
      },
      toggleEditability: function() {
        // return this.itemIsCurrentlyEditable ? this.removeCurrentlyEditable() : this.addCurrentlyEditable(this.item)
        return ! this.itemIsCurrentlyEditable ? this.addCurrentlyEditable(this.item): true
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
      checkboxClass: function() {
        return this.checkboxClassOverride ? this.checkboxClassOverride : this.item.checked_at ? 'fa-check' : 'fa-circle-thin'
      },
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
        return this.currentEditableItem.id && this.item.id == this.currentEditableItem.id
      },
      deadlinePlaceholder: function () {
        return this.item.deadline ? moment(this.item.deadline).format('MMM DD') : undefined
      }
    }
}
</script>
