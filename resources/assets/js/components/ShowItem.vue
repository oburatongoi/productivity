<template lang="html">
  <div class="show-item">

    <div class="pretty inline outline-success plain smooth">
      <input type="checkbox" :checked="item.checked_at" @click="checkItem"/>
      <label><i class="fa fa-check"></i></label>
    </div>
    <p @click="edit">
      {{ item.content }}
    </p>

    <i class="fa fa-fw fa-angle-down toggle" aria-hidden="true" @click="edit"></i>

    <p class="preview-deadline" v-if="deadlinePlaceholder" @click="edit">
      {{ deadlinePlaceholder }}
    </p>

  </div>
</template>

<script>
import { mapActions } from 'vuex'
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
    deadlinePlaceholder: function () {
      return this.item.deadline ? moment(this.item.deadline).format('MMM D') : undefined
    },
  },
}
</script>
