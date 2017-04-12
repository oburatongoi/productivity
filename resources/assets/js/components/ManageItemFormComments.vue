<template lang="html">
  <div class="edit-comments" id="quill-boundary">
    <!-- <div class="comments-label">
      <i class="fa fa-note" aria-hidden="true"></i>
      Notes
    </div> -->

    <quill-editor class="quill-editor"
                  :content="currentEditableItem.comments"
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
          toolbar: [
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
            [{ 'script': 'sub'}, { 'script': 'super' }],
            [{ 'indent': '-1'}, { 'indent': '+1' }],
            ['link', 'code-block']
          ]
        },
        scrollingContainer: '#quill-boundary',
        placeholder: 'Add a note...',
        theme: 'bubble',
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
