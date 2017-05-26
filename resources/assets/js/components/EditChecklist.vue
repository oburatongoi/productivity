<template lang="html">
  <div class="edit-checklist">
    <h4>List Type</h4>
    <div class="list-type-option">
      <input type="radio" id="ch" value="ch" v-model="checklist.list_type" @click="saveChanges">
      <span>
        <label for="ch">
          <i class="fa fa-fw fa-list" aria-hidden="true"></i>
          Check List
        </label>
        <p class="notice">List items have a checkbox, but are not tasks</p>
      </span>
    </div>

    <div class="list-type-option">
      <input type="radio" id="ta" value="ta" v-model="checklist.list_type" @click="saveChanges">
      <span>
        <label for="ta">
          <i class="fa fa-fw fa-list-alt" aria-hidden="true"></i>
          Task List
        </label>
        <p class="notice">List items are tasks which must be completed</p>
      </span>
    </div>

    <div class="list-type-option">
      <input type="radio" id="bu" value="bu" v-model="checklist.list_type" @click="saveChanges">
      <span>
        <label for="bu">
          <i class="fa fa-fw fa-list-ul" aria-hidden="true"></i>
          Bulletted List
        </label>
        <p class="notice">List items will have bullets</p>
      </span>
    </div>

    <div class="list-type-option">
      <input type="radio" id="nu" value="nu" v-model="checklist.list_type" @click="saveChanges">
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
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'edit-checklist',
  data () {
    return {
      unsavedChanges: false,
      isSaving: false
    }
  },
  computed: {
    ...mapGetters([
      'checklist'
    ]),
    saveButtonIcon: function() {
      return this.isSaving ? 'fa-spinner fa-spin' : 'fa-floppy-o'
    }
  },
  methods: {
    ...mapActions([
      'saveChecklist'
    ]),
    saveChanges: function() {
      this.unsavedChanges = this.isSaving = true
      this.saveChecklist(this.checklist)
      .then(
        (checklist) => {
          this.unsavedChanges = this.isSaving = false
        }
      )
      .catch(
        () => {
          alert('Error saving List')
        }
      )
    },
    close: function() {
      this.$emit('close');
    }
  }
}
</script>

<style lang="css">
</style>
