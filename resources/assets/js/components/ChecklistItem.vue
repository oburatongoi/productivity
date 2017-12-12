<template>
  <li v-show="itemIsVisible" class="show-item" :class="{'is-selected':itemIsSelected}" @click.self="emitClick({selection: {model, listing: item, parentModel}, event: $event})" draggable>
    <span class="checkbox-container">
      <i class="fa fa-fw" :class="checkboxClass" aria-hidden="true" @click="checkItem" v-if="listType&&listType=='ch'||listType=='ta'"></i>
      <i class="fa fa-fw fa-circle" aria-hidden="true" v-if="listType&&listType=='bu'"></i>
      <span class="ol-number" aria-hidden="true" v-if="listType&&listType=='nu'">{{item.sort_order + 1}}.</span>
    </span>

    <p class="show-item-content" @click="emitClick({selection: {model, listing: item, parentModel}, event: $event})" @dblclick="emitClick({selection: {model, listing: item, parentModel}, event: $event})">
      {{ item.content }}
    </p>

    <i class="fa fa-fw fa-angle-down toggle" aria-hidden="true" @click="emitClick({selection: {model, listing: item, parentModel}, event: $event})" @dblclick="emitClick({selection: {model, listing: item, parentModel}, event: $event})"></i>

    <p class="preview-deadline" @click="emitClick({selection: {model, listing: item, parentModel}, event: $event})" @dblclick="emitClick({selection: {model, listing: item, parentModel}, event: $event})">
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
  </li>
</template>

<script>

import { mapActions, mapGetters } from 'vuex'

export default {
    name: 'checklist-item',
    props: {
      item: {
        type: Object
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
        model: 'checklist-item'
      }
    },
    methods: {
      ...mapActions([
        'checkChecklistItem',
      ]),
      checkItem: function() {
        this.checkboxClassOverride = 'fa-circle-o-notch fa-spin'
        this.checkChecklistItem(this.item)
            .then( () => this.checkboxClassOverride = null )
            .catch( () => this.checkboxClassOverride = null )
      },
      emitClick: function(payload) {
        this.$emit('onEmitClick', payload)
      }
    },
    computed: {
      ...mapGetters([
        'selected',
        'unfilteredItems',
        'currentEditableItem',
        'delistedItems',
        'filters'
      ]),
      checkboxClass: function() {
        return this.checkboxClassOverride ? this.checkboxClassOverride : this.item.checked_at ? 'fa-check' : 'fa-circle-thin'
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
        return this.currentEditableItem.id && this.item.id == this.currentEditableItem.id
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

<style lang="scss">
.show-item {
    @include desktop-overflow-y;
    border-bottom: 1px solid lighten($base-border-color, 10%);
    font-family: $paragraph-font-family-sans-serif;
    &.is-selected,
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

    &.is-selected {
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

}

.checkbox-container {
    display: inline-block;
    width: 30px;
    text-align: center;

    .fa {
        cursor: pointer;
    }

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
