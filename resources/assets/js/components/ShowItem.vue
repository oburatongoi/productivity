<template lang="html">
  <div class="show-item" :class="{'is-selected':itemIsCurrentlyEditable}" @click.self="edit">

    <div class="pretty inline outline-success plain smooth" @click="checkItem">
      <input type="checkbox" :checked="item.checked_at"/>
      <label><i class="fa fa-check"></i></label>
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
export default {
  name: 'show-item',
  props: ['item'],
  methods: {
    ...mapActions([
      'check',
      'setEditability'
    ]),
    checkItem: function() {
      let action = '';
      if (this.item.checked_at) {
        action = 'uncheck'
      } else {
        action = 'check'
      }
      return this.check({ item: this.item, action: action })
    },
    edit: function() {
      return this.setEditability({editable: true, item:this.item })
    }
  },
  computed: {
    ...mapGetters([
      'editableItems',
      'currentEditableItem'
    ]),
    itemIsCurrentlyEditable: function() {
      return this.item.id == this.currentEditableItem.id
    },
    deadlinePlaceholder: function () {
      return this.item.deadline ? moment(this.item.deadline).format('MMM DD') : undefined
    },
  },
}
</script>
