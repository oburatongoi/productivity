<template>
  <div v-if="itemIsVisible" class="show-item" :class="{'is-selected':itemIsSelected}" @click.self="toggleSelection({selection: {model: 'checklist-item', listing: item}, event: $event})">
    <span class="checkbox-container">
      <i class="fa fa-fw" :class="checkboxClass" aria-hidden="true" @click="checkItem" v-if="type&&type=='ch'||type=='ta'"></i>
      <i class="fa fa-fw fa-circle" aria-hidden="true" v-if="type&&type=='bu'||type=='nu'"></i>
    </span>

    <p class="show-item-content" @click="toggleSelection({selection: {model: 'checklist-item', listing: item}, event: $event})" @dblclick="toggleSelection({selection: {model: 'checklist-item', listing: item}, event: $event})">
      {{ item.content }}
    </p>

    <i class="fa fa-fw fa-angle-down toggle" aria-hidden="true" @click="toggleSelection({selection: {model: 'checklist-item', listing: item}, event: $event})" @dblclick="toggleSelection({selection: {model: 'checklist-item', listing: item}, event: $event})"></i>

    <p class="preview-deadline" @click="toggleSelection({selection: {model: 'checklist-item', listing: item}, event: $event})" @dblclick="toggleSelection({selection: {model: 'checklist-item', listing: item}, event: $event})">
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

    <div v-if="itemIsCurrentlyEditable&&item.checklist" class="show-item-breadcrumbs">
      <span v-if="item.checklist.folder">
        <i class="fa fa-fw fa-folder" aria-hidden="true"></i>
        {{item.checklist.folder.name}}
        <i class="fa fa-fw fa-angle-right" aria-hidden="true"></i>
      </span>

      <span>
        <i class="fa fa-fw fa-list" aria-hidden="true"></i> {{item.checklist.title}}
      </span>
    </div>
  </div>
</template>

<script>

import { mapActions, mapGetters } from 'vuex'

export default {
    name: 'checklist-item',
    props: {
      item: {
        type: Object
      },
      type: {
        type: String,
        default: 'undefined'
      }
    },
    data () {
      return {
          checkboxClassOverride: null
      }
    },
    methods: {
      ...mapActions([
        'saveCurrentEditableItem',
        'toggleSelection'
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
      }
    },
    computed: {
      ...mapGetters([
        'selected',
        'unfilteredItems',
        'currentEditableItem',
        'deletedItems',
        'delistedItems',
        'filters'
      ]),
      checkboxClass: function() {
        return this.checkboxClassOverride ? this.checkboxClassOverride : this.item.checked_at ? 'fa-check' : 'fa-circle-thin'
      },
      itemBypassesFilters: function() {
        return this.unfilteredItems.indexOf(this.item.id) !== -1
      },
      itemIsDeleted: function() {
        return this.deletedItems.indexOf(this.item.id) !== -1
      },
      itemIsDelisted: function() {
        return this.delistedItems.indexOf(this.item.id) !== -1
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
        return this.itemBypassesFilters || !this.itemIsDelisted && !this.itemIsDeleted && this.itemPassesCheckedFilter && this.itemPassesPriorityFilter
      },
      itemIsCurrentlyEditable: function() {
        return this.currentEditableItem && this.currentEditableItem.id && this.item.id == this.currentEditableItem.id
      },
      itemIsSelected: function() {
        return this.selected.checklistItems.indexOf(this.item) !== -1
      },
      deadlinePlaceholder: function () {
        return this.item.deadline ? moment(this.item.deadline).format('MMM DD') : undefined
      }
    }
}
</script>
