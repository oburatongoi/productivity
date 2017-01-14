<template lang="html">
  <div>
      <div class="form-group">
          <input type="text" v-model="name" placeholder="Folder Name">
      </div>

      <div class="form-group">
          <button type="button" class="btn btn-default btn-sm" @click="cancel">Cancel</button>
          <button type="button" class="btn btn-primary btn-sm" @click="createFolder">Create</button>
      </div>
  </div>
</template>

<script>

export default {
    name: 'folders-create',
    data () {
        return {
            name: undefined
        }
    },
    methods: {
        cancel: function() {
            this.$emit('cancel')
        },
        createFolder: function() {
            this.$emit('create', this.name)
        }
    }
}
</script>
