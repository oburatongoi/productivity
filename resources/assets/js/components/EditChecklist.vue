<template lang="html">
  <div class="edit-checklist" @change="saveChanges">
    <h4>{{ listTypeTitle }}</h4>
    <div class="list-type-option">
      <div class="list-type-option-inner">
        <input type="radio" id="ch" value="ch" v-model="checklist.list_type">
        <span>
          <label for="ch">
            <i class="fa fa-fw fa-list" aria-hidden="true"></i>
            Check List
          </label>
          <p class="notice">List items will have a checkbox, but will not be treated as tasks</p>
        </span>
      </div>
      <div class="list-type-option-inner">
        <input type="radio" id="ta" value="ta" v-model="checklist.list_type">
        <span>
          <label for="ta">
            <i class="fa fa-fw fa-check-square" aria-hidden="true"></i>
            Task List
          </label>
          <p class="notice">List items will be treated as tasks which must be completed</p>
        </span>
      </div>
    </div>

    <div class="list-type-option">
      <input type="radio" id="bu" value="bu" v-model="checklist.list_type">
      <span>
        <label for="bu">
          <i class="fa fa-fw fa-list-ul" aria-hidden="true"></i>
          Bulletted List
        </label>
        <p class="notice">List items will have bullets</p>
      </span>
    </div>

    <div class="list-type-option">
      <input type="radio" id="nu" value="nu" v-model="checklist.list_type">
      <span>
        <label for="nu">
          <i class="fa fa-fw fa-list-ol" aria-hidden="true"></i>
          Numbered List
        </label>
        <p class="notice">List Items will have numbers</p>
      </span>
    </div>

    <div class="form-group">
      <button type="button" class="btn btn-sm btn-primary" @click.prevent="close">
        <i class="fa" :class="saveButtonIcon" aria-hidden="true"></i>
        Save
      </button>
    </div>
  </div>
</template>

<script>

const { observe } = require('dirty-object'); // used to check if object has ben modified before saving

export default {
  name: 'edit-checklist',
  props: {
    checklist: {
      type: Object,
      required: true
    },
    isSaving: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    saveButtonIcon: function() {
      return this.isSaving ? 'fa-spinner fa-spin' : 'fa-floppy-o'
    },
    listTypeTitle: function() {
      return ! this.checklist.list_item ? 'Please select a list type' : 'List Type'
    }
  },
  methods: {
    saveChanges: function() {
      this.$emit('saveChanges');
    },
    close: function() {
      this.$emit('close');
    }
  }
}
</script>

<style lang="scss">
.edit-checklist {
    .list-type-option-inner,
    .list-type-option {
        margin-bottom: 20px;
        display: block;
        border: 1px solid $base-border-color;
        border-radius: $base-border-radius;
        padding: 10px 10px 10px 15px;



        input {
            display: inline-block;
            margin-right: 10px;
            vertical-align: middle;
            // height: 50px;
        }

        & > span {
            display: inline-block;
            vertical-align: middle;
            // height: 50px;
            border-left: 1px solid $base-border-color;
            padding-left: 10px;
            margin-left: 0;
            label {
                margin-bottom: 0;
            }
            p {
                margin-top: 0;
                margin-bottom: 0;
                color: $grey-text-color;
            }
        }
    }
    .list-type-option-inner {
      margin: 0;
      border: 0;
      padding: 0;
      &:not(:first-child) {
        margin-top: 15px;
      }
    }
}
</style>
