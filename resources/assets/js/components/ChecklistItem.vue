<template>
  <li v-show="itemIsVisible" class="show-item" :class="{'selected':itemIsSelected}" @click.self="toggleSelection({selection: {model, listing: item, parentModel}, event: $event})" draggable>
    <span class="checkbox-container">
      <i class="fa fa-fw" :class="checkboxClass" aria-hidden="true" @click="checkItem" v-if="listType&&listType=='ch'||listType=='ta'"/>
      <i class="fa fa-fw fa-circle" aria-hidden="true" v-if="listType&&listType=='bu'"/>
      <span class="ol-number" aria-hidden="true" v-if="listType&&listType=='nu'">{{ item.sort_order + 1 }}.</span>
    </span>

    <p
      class="show-item-content"
      @click="toggleSelection({selection: {model, listing: item, parentModel}, event: $event})"
      @dblclick="toggleSelection({selection: {model, listing: item, parentModel}, event: $event})"
    >
      {{ item.content }}
      <span
        class="unchecked-sub-items-count"
        v-if="uncheckedSubItemsCount"
        v-tooltip.bottom="checklistTooltip"
      >
        <i class="fa fa-fw fa-check-square" aria-hidden="true"/>
        {{ uncheckedSubItemsCount }}</span>
    </p>

    <item-form-meta
      :item="item"
      :is-sub-item="isSubItem"
      :parent-model="parentModel"
      @showDatePicker="showDatePicker"
    />

    <div v-if="itemIsCurrentlyEditable&&item.checklist" class="show-item-breadcrumbs">
      <span
        v-if="item.checklist.folder"
        @click="navigateTo('folders', item.checklist.folder.fake_id)"
      >
        <i class="fa fa-fw fa-folder" aria-hidden="true"/>
        {{ item.checklist.folder.name }}
        <i class="fa fa-fw fa-angle-right" aria-hidden="true"/>
      </span>

      <span
        @click="navigateTo('lists', item.checklist.fake_id)"
      >
        <i class="fa fa-fw fa-list" aria-hidden="true"/> {{ item.checklist.title }}
      </span>
    </div>

    <div class="datepicker-container" v-if="chooseDate">
      <div class="delete-deadline">
        <button v-if="item.deadline" type="button" class="btn btn-xs btn-default" @click="setDate(null)">
          <i class="fa fa-fw fa-calendar-times-o" aria-hidden="true"/>
             Remove Deadline
        </button>
        <button type="button" class="btn btn-xs btn-default" @click="hideDatePicker">
          <i class="fa fa-fw fa-times" aria-hidden="true"/>
             Cancel
        </button>
      </div>

      <datepicker
        :value="item.deadline"
        @selected="setDate"
        :inline="true"
        :highlighted="highlightedDate"
      />
    </div>
  </li>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import ItemFormMeta from './ItemFormMeta.vue'
import Datepicker from 'vuejs-datepicker';

export default {
    name: 'checklist-item',
    components: {
      Datepicker,
      ItemFormMeta
    },
    props: {
      item: {
        type: Object,
        required: true
      },
      listType: {
        type: String,
        default: 'ch'
      },
      parentModel: {
        type: String,
        default: 'checklist'
      }
    },
    data () {
      return {
        checkboxClassOverride: null,
        model: 'checklist-item',
        chooseDate: false
      }
    },
    computed: {
      ...mapGetters([
        'selected',
        'unfilteredItems',
        'editableItem',
        'delistedItems',
        'filters'
      ]),
      checkboxClass: function() {
        return this.checkboxClassOverride ? this.checkboxClassOverride : this.item.checked_at ? 'fa-check' : this.isSubItem ? 'fa-square-o' : 'fa-circle-thin'
      },
      highlightedDate () {
        return {
          dates: [
            this.item.deadline ? new Date(this.item.deadline) : new Date()
          ]
        }
      },
      itemBypassesFilters: function() {
        return this.unfilteredItems.indexOf(this.item.id) !== -1
      },
      itemIsDelisted: function() {
        return this.delistedItems.indexOf(this.item.id) !== -1
      },
      itemPassesCheckedFilter: function() {
        if (this.parentModel == 'checklist-item') return true

        if (this.listType == 'nu' || this.listType == 'bu' || this.filters.checked == 'all') return true

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
        if (this.filters.priority == 'none') return true

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
        return this.editableItem.id && this.item.id == this.editableItem.id
      },
      itemIsSelected: function() {
        return this.selected.checklistItems.indexOf(this.item) !== -1
      },
      deadlinePlaceholder: function () {
        return this.item.deadline ? moment(this.item.deadline).format('MMM DD') : undefined
      },
      isSubItem: function() {
        return this.parentModel == 'checklist-item' || ! this.item.checklist_id ? true : false;
      },
      uncheckedSubItemsCount: function() {
        return this.item.child_list_items ? _.countBy(this.item.child_list_items, i => i.checked_at == null).true : 0
      },
      checklistTooltip: function () {
        return this.item.child_list_items && this.item.child_list_items.length ? this.uncheckedSubItemsCount +' unchecked items' : 'Does not have any checklist items'
      },
    },
    methods: {
      ...mapActions([
        'checkChecklistItem',
        'setChecklistItemDeadline',
      ]),
      checkItem: function() {
        this.checkboxClassOverride = 'fa-circle-o-notch fa-spin'
        this.checkChecklistItem(this.item)
            .then( () => this.checkboxClassOverride = null )
            .catch( () => this.checkboxClassOverride = null )
      },
      toggleSelection: function(payload) {
        return this.$eventHub.$emit('toggleSelection', payload);
      },
      showDatePicker: function() {
        return this.chooseDate = true
      },
      hideDatePicker: function() {
        return this.chooseDate = false
      },
      navigateTo: function(model, id) {
        return window.location.href = '/'+model+'/'+id
      },
      setDate: function(date = null) {
        this.setChecklistItemDeadline({item: this.item, date, isSubItem: this.isSubItem})
            .then( (success) => {
              this.hideDatePicker()
            })
            .catch( (error) => {
              this.hideDatePicker()
              console.log(error)
            })
      },
    },
}
</script>

<style lang="scss">
.show-item {
  // @include desktop-overflow-y;
  border-bottom: 1px solid lighten($base-border-color, 10%);
  font-family: $paragraph-font-family-sans-serif;
  position: relative;
  &.selected,
  &:hover {
      background: lighten($body-bg, 1%);

      .fa-angle-down.toggle {
          color: $brand-primary;
          -webkit-transform: rotate(-90deg);
          -moz-transform: rotate(-90deg);
          -ms-transform: rotate(-90deg);
          -o-transform: rotate(-90deg);
          transform: rotate(-90deg);
      }
  }

  &.selected {
      border: 1px solid $brand-primary;
      border-radius: 2px;
      padding-left: 10px;
      // color: black;
      .show-item-content {
          color: $brand-primary;
      }
  }

  p, i {
      display: inline-block;
      margin:0;
      vertical-align: middle;
  }
  p {
      cursor: pointer;
      @media(min-width:992px){
          white-space: nowrap;
          @include desktop-overflow-y;
          text-overflow: ellipsis;
      }
  }
  i {
      font-size: 1.8em;
      line-height: 1em;
      margin: 0;
      padding: 0;
  }

  .show-item-content {
    width: 60%;

    .unchecked-sub-items-count {
      color: darken($item-form-border-color, 5%);
      font-size: 0.85em;
      line-height: inherit;
      .fa {
        font-size: 0.9em;
      }
    }

    @media(min-width:768px){
        width: 75%;
        padding: 5px 0;
        font-size: 1em;
        line-height: 0.7em;
    }
    @media(min-width:992px){
        width: 75%;
        padding: 7px 0;
        white-space: nowrap;
        @include desktop-overflow-y;
        text-overflow: ellipsis;
    }
    @media(min-width:1200px){
        width: 80%;
        padding: 10px 0;
        font-size: 1.1em;
        line-height: 1em;
    }
  }

  .preview-deadline,
  .toggle {
      float: right;
      margin-top: 5px;
      margin-right: 5px;
      cursor: pointer;
  }
  .toggle {
      font-size: 16px;
      padding: 7px;
      &:hover {
          color: $brand-primary;
      }
  }
  .preview-deadline {
      font-size: 0.75em;
      margin-top: 10px;
      color: darken($base-border-color, 20%);
      .fa {
          font-size: 1.2em;
      }
      span {
          margin-right: 5px;
      }
  }
  // .show-item-breadcrumbs {
  //   cursor: pointer;
  //   & span:hover {
  //     text-decoration: underline;
  //     text-decoration-style: dotted;
  //     text-decoration-color: $brand-primary;
  //     .fa {
  //       text-decoration: none;
  //     }
  //   }
  // }

  .show-item-breadcrumbs {
      margin: 0;
      padding-left: 35px;
      cursor: pointer;
      span {
          font-size:0.8em;
          color: $brand-primary;
          .fa {
              font-size: 0.8em;
          }
          .fa-angle-right {
              color: $grey-text-color;
          }

          &:hover {
            text-decoration: underline;
            text-decoration-style: dotted;
            text-decoration-color: $brand-primary;
            .fa {
              text-decoration: none;
            }
          }
      }
  }

}

.checkbox-container {
  display: inline-block;
  width: 30px;
  text-align: center;

  .fa {
      cursor: pointer;
  }

  .fa-square-o,
  .fa-circle-thin {
      color: $input-border;
      font-size: 1.5em;
  }

  .fa-circle-o-notch {
      color: $input-border;
      font-size: 1em;
  }

  .ol-number,
  .fa-check {
      color: $brand-primary;
      font-size: 1em;
  }

  .ol-number {
      font-weight: bold;
  }

  .fa-circle {
      color: $brand-primary;
      font-size: 0.7em;
  }
}
</style>
