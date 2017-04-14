<template lang="html">
  <div class="edit-comments" id="quill-boundary">

    <quill-editor :content="currentEditableItem.comments"
                  :options="quillOptions"
                  @change="onEditorChange($event)">
    </quill-editor>


    <!-- <textarea
      @change="debounceSaveChanges"
      @keyup="debounceSaveChanges"
      @keydown="debounceSaveChanges"
      @delete="debounceSaveChanges"
      class="comments-textarea"
      v-model="currentEditableItem.comments"
      placeholder="Add a comment..."
      maxlength="25000"></textarea> -->

  </div>
</template>

<script>
import { mapGetters } from 'vuex'

import QuillEditor from './QuillEditor.vue'

export default {
  name: 'manage-item-form-comments',
  data () {
    return {
      quillOptions: {
        modules: {
          toolbar: '#quill-toolbar'
        },
        scrollingContainer: '#quill-boundary',
        placeholder: 'Add a note...',
        // theme: 'bubble',
        theme: 'snow',
        bounds: '#comments-textarea'
      }
    }
  },
  computed: {
    ...mapGetters([
      'currentEditableItem'
    ])
  },
  methods: {
    debounceSaveChanges: _.debounce(function() {
      this.saveChanges()
    }, 1000),
    saveChanges: function() {
      this.$emit('saveChanges')
    },
    onEditorChange({ editor, html, text }) {
      this.currentEditableItem.comments = html
      this.debounceSaveChanges()
    }
  },
  components: {
    QuillEditor
  }
}
</script>

<style lang="css">

</style>
