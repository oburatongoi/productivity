<template lang="html">
  <div id="comments-textarea"/>
</template>

<script>
import Quill from 'quill'

export default {
  name: 'quill-editor',
  props: {
    content: {
      type: String,
      default: null
    },
    value: {
      type: String,
      default: null
    },
    options: {
      type: Object,
      required: false,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      quillContent: '',
      defaultModules: {
        toolbar: [
          [{ header: [2, 3, 4, false] }],
          ['bold', 'italic', 'underline', 'strike'],
          [{ 'list': 'ordered'}, { 'list': 'bullet' }],
          [{ 'script': 'sub'}, { 'script': 'super' }],
          [{ 'indent': '-1'}, { 'indent': '+1' }],
          ['link', 'code-block']
        ]
      }
    }
  },
  watch: {
    'content'(newVal, oldVal) {
      if (this.quill) {
        if (!!newVal && newVal !== this.quillContent) {
          this.quillContent = newVal
          this.quill.pasteHTML(newVal)
        } else if(!newVal) {
          this.quill.setText('')
        }
      }
    },
    'value'(newVal, oldVal) {
      if (this.quill) {
        if (newVal !== this.quillContent) {
          this.quillContent = newVal
          this.quill.pasteHTML(newVal)
        } else if(!newVal) {
          this.quill.setText('')
        }
      }
    }
  },
  mounted() {
    this.initialize()
  },
  beforeDestroy() {
    this.quill = null
  },
  methods: {
    initialize() {
      if (this.$el) {
        // options and instance
        var self = this
        self.options.scrollingContainer = self.options.scrollingContainer
        self.options.theme = self.options.theme || 'bubble'
        self.options.bounds = self.options.bounds || document.getElementById('quill-boundary')
        self.options.boundary = self.options.boundary || document.getElementById('quill-boundary')
        self.options.modules = self.options.modules || self.defaultModules
        self.options.modules.toolbar = self.options.modules.toolbar || self.defaultModules.toolbar
        self.options.placeholder = self.options.placeholder || 'Insert text here ...'
        self.options.readOnly = self.options.readOnly !== undefined ? self.options.readOnly : false
        self.options.modules.toolbar = self.options.modules.toolbar || defaultOptions.modules.toolbar
        self.options.modules.syntax = true
        self.quill = new Quill(self.$el, self.options)
        // set editor content
        if (self.value || self.content) {
          self.quill.pasteHTML(self.value || self.content)
        }
        // mark model as touched if editor lost focus
        self.quill.on('selection-change', (range) => {
          if (!range) {
            self.$emit('blur', self.quill)
          } else {
            self.$emit('focus', self.quill)
          }
        })
        // update model if text changes
        self.quill.on('text-change', (delta, oldDelta, source) => {
          var html = self.$el.children[0].innerHTML
          const text = self.quill.getText()
          if (html === '<p><br></p>') html = ''
          self.quillContent = html
          self.$emit('input', self.quillContent)
          self.$emit('change', {
            editor: self.quill,
            html: html,
            text: text
          })
        })
        // emit ready
        self.$emit('ready', self.quill)
      }
    }
  },
}
</script>

<style lang="css">

</style>
