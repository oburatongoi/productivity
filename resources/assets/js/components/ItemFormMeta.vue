<template lang="html">
  <div class="item-form-meta" :class="{ 'new-item':item.isNewItem }">
    <span class="meta-span"
      @click="showDatePicker"
      v-tooltip.bottom="deadlineTooltip"
      :class="{ 'item-deadline':!item.isNewItem }"
    >
      <span class="date">{{ deadlinePlaceholder }}</span>
      <i
        class="fa fa-fw fa-calendar"
        aria-hidden="true"
      />
    </span>

    <span class="meta-span">
      <i
        @click="toggleImportance"
        :class="importanceIcon"
        class="fa fa-fw"
        aria-hidden="true"
        v-tooltip.bottom="importanceTooltip"
      />
    </span>

    <span class="meta-span">
      <i
        @click="toggleUrgency"
        :class="{ 'folder-color-scheme':item.is_urgent }"
        class="fa fa-fw fa-clock-o"
        aria-hidden="true"
        v-tooltip.bottom="urgencyTooltip"
      />
    </span>

    <span class="meta-span"
      v-if="!item.isNewItem"
    >
      <i
        @click="toggleSelection({selection: {model, listing:item, parentModel}, event: $event})"
        :class="{ 'folder-color-scheme':item.comments }"
        class="fa fa-fw fa-sticky-note-o"
        aria-hidden="true"
        v-tooltip.bottom="commentsTooltip"
      />
    </span>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'item-form-meta',
  props: {
    item: {
      type: Object,
      required: true
    },
    isSubItem: {
      type: Boolean,
      default: false
    },
    parentModel: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      urgencyIsLoading: false,
      importanceIsLoading: false,
      deadlineIsLoading: false,
      model: 'checklist-item',
    }
  },
  computed: {
    deadlinePlaceholder: function () {
      // return this.item.deadline ? moment(this.item.deadline).format('MMM D') : this.item.isNewItem ? '' : '---  --'
      return this.item.deadline ? moment(this.item.deadline).format('MMM D') : ''
    },
    urgencyTooltip: function () {
      return this.item.is_urgent ? 'Mark as not urgent' : 'Mark as urgent'
    },
    importanceTooltip: function () {
      return this.item.is_important ? 'Mark as not important' : 'Mark as important'
    },
    deadlineTooltip: function () {
      return this.item.deadline ? 'Change or remove deadline' : 'Add a deadline'
    },
    commentsTooltip: function () {
      return this.item.comments ? 'Has notes' : 'Does not have any notes'
    },
    importanceIcon: function () {
      return this.item.is_important ? 'fa-star folder-color-scheme' : 'fa-star-o'
    },
  },
  methods: {
    ...mapActions([
      'toggleChecklistItemImportance',
      'toggleChecklistItemUrgency'
    ]),
    showDatePicker: function() {
      return this.$emit('showDatePicker')
    },
    toggleImportance: function() {
      this.importanceIsLoading = true
      if (this.item.isNewItem) return this.item.is_urgent = ! this.item.is_urgent

      return this.toggleChecklistItemImportance({item: this.item, isSubItem: this.isSubItem})
          .then( () => this.importanceIsLoading = false )
          .catch( (error) => console.log(error) )
    },
    toggleUrgency: function() {
      this.urgencyIsLoading = true
      if (this.item.isNewItem) return this.item.is_important = ! this.item.is_important

      return this.toggleChecklistItemUrgency({item: this.item, isSubItem: this.isSubItem})
          .then( () => this.urgencyIsLoading = false )
          .catch( (error) => console.log(error) )
    },
    toggleSelection: function(payload) {
      return this.$eventHub.$emit('toggleSelection', payload);
    },
  },
}
</script>

<style lang="scss">
.item-form-meta {
  display: block;
  width: 100%;
  border-top: 1px solid $item-form-border-color;
  background: white;

  .show-item.selected &,
  .show-item:hover & {
    background: $body-bg;
  }

  &.new-item {
    border-left: 1px solid $item-form-border-color;
    background: $body-bg;
  }
  @media(min-width:768px){
    display: inline-block;
    position: absolute;
    @include high-z-index(1);
    top: 0;
    bottom: 0;
    right: 0;
    width: auto;
    vertical-align: middle;
    border-top: 0;

  }
  margin:0;
  height: $item-form-height;
  padding: 0 5px;
  text-align: center;
  color: darken($item-form-border-color, 5%);
  &:hover {
    color: darken($item-form-border-color, 10%);
  }

  .meta-span {
    padding: 0;
    margin: 0;
    margin-left: 5px;
    display: inline-block;
    font-size:0.85em;
    line-height: $item-form-height;
    cursor: pointer;

    &:last-child {
      margin-right: 5px;
    }

    &.item-deadline {
      text-align: right;
      .date {
        display: inline-block;
        width: 40px;
      }
    }

    .show-item & .fa {
      font-size: 1.1em;
    }
  }
}
</style>
