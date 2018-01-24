<template lang="html">
  <nav class="action-nav">
    <div class="available-actions">
      <template v-if="!selected.deletable">
        <button
          type="button"
          id="toggle-move-btn"
          class="btn btn-sm toggle-move-btn"
          :class="moveButtonClass"
          @click.prevent="toggleMovable"
        ><i class="fa fa-exchange" aria-hidden="true"/> Move</button>
      </template>

      <button
        type="button"
        id="confirm-or-delete-btn"
        class="btn btn-default btn-sm toggle-delete-btn"
        :class="{ 'delete-armed': selected.deletable }"
        @click.prevent="confirmOrDelete"
        @dblclick.prevent="confirmOrDelete"
      ><i class="fa fa-trash-o" aria-hidden="true"/><span v-if="selected.deletable"> Delete</span></button>

      <button
        type="button"
        id="toggle-delete-btn"
        class="btn btn-default btn-sm toggle-delete-btn"
        v-if="selected.deletable"
        @click.once="toggleDeletable"
      ><i class="fa fa-times" aria-hidden="true"/></button>

      <button
        type="button"
        id="clear-selected-btn"
        class="btn btn-sm btn-default"
        v-if="!selected.deletable"
        @click.prevent="clearSelected"
      ><i class="fa fa-times" aria-hidden="true"/></button>
    </div>
  </nav>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'action-nav',
  computed: {
    ...mapGetters([
      'selected',
    ]),
    moveButtonClass: function() {
      if (!this.selected.folders.length && this.selected.checklists.length || this.selected.checklistItems.length) {
        return 'btn-list'
      }
      return 'btn-folder'
    }
  },
  methods: {
    ...mapActions([
      'deleteSelection',
      'clearSelected',
      'toggleEditability',
      'toggleDeletable',
      'toggleMovable'
    ]),
    confirmOrDelete: function() {
      return this.selected.deletable ? this.deleteSelection() : this.toggleDeletable()
    }
  },
}
</script>

<style lang="scss">
.action-nav {
    text-align: center;
    padding: 0 10px;
    position: absolute;
    @include high-z-index(0);
    top: 5px;
    right: 20px;
    @include clearfix;
    background: white;
    border-left: 1px solid $base-border-color;

    .available-actions {
        position: relative;
        display: inline-block;
        width: auto;
        p {
            font-size: 0.9em;
        }
    }
}

.toggle-delete-btn,
.toggle-move-btn {
    &:not(:first-child) {
        margin-left: 5px;
    }
}

.toggle-delete-btn {
    &,
    &:focus,
    &:active {
        outline: none;
        background: transparent;
    }
    &.delete-armed {
      margin-right: 30px;
        color: $brand-danger;
        border: 1px solid $brand-danger;
        &:hover {
            background: $brand-danger;
            color: white;
        }
    }
}
</style>
