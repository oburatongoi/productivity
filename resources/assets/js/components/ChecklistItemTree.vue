<template lang="html">
  <div class="panel side-panel checklist-item-tree">
    <div class="panel-body">
      <ul>
        <li
        v-if="checklist"
        class="item"
        @click="emitClick({selection: {model: 'checklist', listing: checklist, parentModel: 'folder'}, event: $event})"
        >
          <i class="fa fa-fw fa-list-ul" aria-hidden="true"></i>
          {{checklist.title}}
        </li>
        <li
        v-if="!checklist"
        class="item"
        @click="emitClick({event: $event})"
        >
          <i class="fa fa-fw fa-home" aria-hidden="true"></i>
          Home
        </li>
        <li>
          <ul class="nested-tree">
            <li
            class="item"
            @click="emitClick({selection: {model: 'checklist-item', listing: item, parentModel: 'checklist'}, event: $event})"
            >
              <i class="fa fa-fw fa-check" aria-hidden="true" v-if="item.checked_at"></i>
              <i class="fa fa-fw fa-circle-thin" aria-hidden="true" v-if="!item.checked_at"></i>
              {{item.content}}
            </li>
            <li>
              <ul class="nested-tree">
                <li
                v-for="subItem in item.child_list_items"
                class="item"
                :class="{selected: subItem.id==editableSubItem.id}"
                @click="emitClick({selection: {model: 'checklist-item', listing: subItem, parentModel: 'checklist-item'}, event: $event})"
                :key="subItem.id"
                >
                  <i class="fa fa-fw fa-check" aria-hidden="true" v-if="subItem.checked_at"></i>
                  <i class="fa fa-fw fa-square-o" aria-hidden="true" v-if="!subItem.checked_at"></i>
                  {{subItem.content}}
                </li>
              </ul>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'checklist-item-tree',
  props: {
    checklist: undefined,
    item: {
      type: Object,
      required: true
    }
  },
  methods: {
    emitClick: function(payload) {
      this.$emit('onSelection', payload)
    }
  },
  computed: {
    ...mapGetters([
      'editableSubItem'
    ])
  }
}
</script>

<style lang="scss">
.checklist-item-tree {
  font-size: 1.1em;
  .panel-body {
    height: 100%;
    overflow-y: scroll;
  }

  ul {
    list-style: none;
    padding-left: 20px;
    margin-top: 0;
  }
  li.item {
    // padding-left: 10px;
    &:hover {
      background: $body-bg;
    }
    &.selected {
      border: 1px dashed $base-border-color;
      border-radius: 2px;
      background: $body-bg;
    }
  }
  .nested-tree {
    border-left: 1px dashed $base-border-color;
    margin-left: 10px;
  }

  .fa-square-o {
      color: $input-border;
  }
  .fa-circle-thin,
  .fa-home,
  .fa-list-ul {
    color: $brand-primary;
  }
}
</style>
