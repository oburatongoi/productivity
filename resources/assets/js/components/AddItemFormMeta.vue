<template lang="html">
  <div class="item-form-meta">
    <span class="item-form-bool">
      <label for="is-important">Important</label>
      <input type="checkbox" id="is-important" v-model="newChecklistItem.is_important">
    </span>

    <span class="item-form-bool">
      <label for="is-urgent">Urgent</label>
      <input type="checkbox" id="is-urgent" v-model="newChecklistItem.is_urgent">
    </span>

    <span class="item-form-date">
      <label for="deadline">Deadline</label>
      <p @click="showDatePicker">
        <i class="fa fa-fw fa-calendar" aria-hidden="true"></i>
        {{deadlinePlaceholder}}
      </p>
      <i class="fa fa-fw fa-times delete-checklist-item" aria-hidden="true" v-if="this.newChecklistItem.deadline" @click="removeDeadline"></i>
    </span>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'item-form-meta',
  data () {
    return {
      showComments: false
    }
  },
  computed: {
    ...mapGetters([
      'newChecklistItem'
    ]),
    deadlinePlaceholder: function () {
      return this.newChecklistItem.deadline ? moment(this.newChecklistItem.deadline).format('MMM D') : '--'
    },
  },
  methods: {
    showDatePicker: function() {
      this.$emit('showDatePicker')
    },
    removeDeadline: function() {
      return this.newChecklistItem.deadline = null
    }
  },
}
</script>
