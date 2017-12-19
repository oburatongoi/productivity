<template lang="html">
  <div class="item-form-meta">
    <span class="item-form-bool">
      <label for="is-important">Important</label>
      <input type="checkbox" id="is-important" v-model="item.is_important">
    </span>

    <span class="item-form-bool">
      <label for="is-urgent">Urgent</label>
      <input type="checkbox" id="is-urgent" v-model="item.is_urgent">
    </span>

    <span class="item-form-date">
      <label for="deadline">Deadline</label>
      <p @click="showDatePicker">
        <i class="fa fa-fw fa-calendar" aria-hidden="true"></i>
        {{deadlinePlaceholder}}
      </p>
      <i class="fa fa-fw fa-times delete-checklist-item" aria-hidden="true" v-if="this.item.deadline" @click="removeDeadline"></i>
    </span>
  </div>
</template>

<script>

export default {
  name: 'item-form-meta',
  props: {
    item: {
      type: Object,
      required: true
    }
  },
  computed: {
    deadlinePlaceholder: function () {
      return this.item.deadline ? moment(this.item.deadline).format('MMM D') : '--'
    },
  },
  methods: {
    showDatePicker: function() {
      this.$emit('showDatePicker')
    },
    removeDeadline: function() {
      return this.item.deadline = null
    }
  },
}
</script>
