<template lang="html">
  <div class="edit-comments" id="quill-boundary">

    <quill-editor :content="item.comments"
                  :options="quillOptions"
                  @change="onEditorChange($event)">
    </quill-editor>


    <!-- <textarea
      @change="debounceSaveChanges"
      @keyup="debounceSaveChanges"
      @keydown="debounceSaveChanges"
      @delete="debounceSaveChanges"
      class="comments-textarea"
      v-model="item.comments"
      placeholder="Add a comment..."
      maxlength="25000"></textarea> -->

  </div>
</template>

<script>
import { mapActions } from 'vuex'
import QuillEditor from './QuillEditor.vue'

export default {
  name: 'manage-item-form-comments',
  props: {
    item: {
      type: Object,
      required: true
    },
    isSubItem: {
      type: Boolean,
      default: false
    }
  },
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
  methods: {
    ...mapActions([
      'setCurrentEditableItemComments'
    ]),
    debounceSaveChanges: _.debounce(function() {
      this.saveChanges()
    }, 1000),
    saveChanges: function() {
      this.$emit('saveChanges')
    },
    onEditorChange({ editor, html, text }) {
      this.setCurrentEditableItemComments({html:html, isSubItem: this.isSubItem})
      this.debounceSaveChanges()
    }
  },
  components: {
    QuillEditor
  }
}
</script>

<style lang="scss">
.edit-checklist-item {
  .edit-comments {
      // min-height: 100%;
      height: 100%;
      padding: 0;
      // padding-bottom: 50px !important;
      padding-bottom: 10px !important; // changed because height is now dynamically calculated
      #comments-textarea.ql-container.ql-snow {
          font-family: $paragraph-font-family-sans-serif !important;
          display: inline-block;
          vertical-align: top;
          border-top-right-radius: 0;
          border-top-left-radius: 0;
          border-bottom-right-radius: 2px;
          border-bottom-left-radius: 2px;
          border: 0;
          outline: none;
          margin: 0;
          padding-top: 10px !important;
          // padding-bottom: 50px !important;
          padding-bottom: 10px !important; // changed because height is now dynamically calculated
          padding-left: 10px;
          padding-right: 10px;
          overflow-y: visible;
          font-size: 1.1em;
          width: 100%;
          height: 100%;
          color: black;
          border: 1px solid $base-border-color;
          border-top: 0;
          .ql-editor {
              padding: 0;

              a {
                  color: $brand-primary !important;
              }
          }
      }
  }
}
</style>
