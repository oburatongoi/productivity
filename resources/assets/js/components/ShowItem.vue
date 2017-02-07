<template lang="html">
  <div class="show-item">

    <div class="pretty inline outline-success plain smooth">
      <input type="checkbox" :checked="item.checked_at" @click="checkItem"/>
      <label><i class="fa fa-check"></i></label>
    </div>
    <p>
      {{ item.content }}
    </p>

    <i class="fa fa-fw fa-angle-down toggle" aria-hidden="true" @click="setEditability({editable: true, item:item })"></i>

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
    }
  },
}
</script>
