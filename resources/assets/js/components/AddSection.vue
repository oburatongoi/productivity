<template lang="html">
  <div class="add-section">
    <span class="add-section-button" @click="toggleAddSection" v-if="!isAddingSection">
      <span>
        <span class="add-section-icon"><i class="far fa-fw fa-cut" aria-hidden="true"/></span>
        <span class="add-section-text">New Section</span>
      </span>
    </span>
    <template v-if="isAddingSection">
      <form class="add-section-form" @submit.prevent="submitForm" autocomplete="off">
        <input type="text" :id="parent.model+'-'+parent.id+'-add-section'" v-model="section.title" placeholder="Name this section" v-focus @blur="resetIfEmpty">
        <i class="far cancel-add-section-icon" :class="addSectionInputIcon" aria-hidden="true" @click="resetAddSection"/>
      </form>

      <span
        class="add-item-lite-ghost"
        :id="'add-item-lite-ghost-'+parent.id"
        v-tooltip.bottom-start="{ content: 'To add item, first save this section', classes: 'checklist-tooltip', trigger: 'hover', autoHide: false, container: '#add-item-lite-ghost-'+parent.id }"
      >
        <i class="far fa-fw fa-plus" aria-hidden="true"/>
        New Item
      </span>
    </template>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  name: 'add-section',
  props: {
    parent: {
      type: Object,
      required: true
    },
  },
  data () {
    return {
      isAddingSection: false,
      isSaving: false,
      section: {
        title: null,
        parent_id: this.parent.id,
        list_type: this.parent.list_type
      }
    }
  },
  computed: {
    addSectionInputIcon: function() {
      return this.isSaving ? 'fa-circle-notch fa-spin' : 'fa-times'
    }
  },
  methods: {
    ...mapActions([
      'storeChecklist',
      'addToKanbanArray',
    ]),
    resetAddSection: function() {
      this.isAddingSection = false
      this.isSaving = false
      this.section = {
        title: null,
        parent_id: this.parent.id,
        list_type: this.parent.list_type
      }
    },
    resetIfEmpty: function() {
      if(!this.section.title) setTimeout(this.resetAddSection, 300)
    },
    submitForm: function() {
      if (!this.section.title) return
      this.isSaving = true
      if (!this.parent.sections) this.$set(this.parent, 'sections', [])
      return this.storeChecklist(this.section) // Section is an alias for a sub checklist
          .then( (newSection) => {
            this.addToKanbanArray( { array: this.parent.sections, value: newSection } )
            this.resetAddSection()
          })
          .catch( () => console.log('Error has occured') )
    },
    toggleAddSection: function() {
      return this.isAddingSection = ! this.isAddingSection
    },
  },
}
</script>

<style lang="scss">
.add-section {
  .add-section-button {
    opacity: 0.5;
    display: block;
    position: relative;
    line-height: 14px;
    cursor: pointer;

    &:hover {
      opacity: 1;

      span .add-section-text {
        // display: inline-block;
        opacity: 1;
      }
    }

    span {
      position: relative;
      z-index: 1;
      padding-left: 2px;
      padding-right: 2px;
      color: darken($base-border-color, 7%);
      font-size: 0.9em;

      &:hover & {
        opacity: 1;
      }

      .add-section-icon,
      .add-section-text {
        background: #fff;
      }

      .add-section-text {
        // display: none;
        opacity: 0;
        margin-left: 2px;
      }
    }

    &::after {
      display: block;
      position: absolute;
      content: "";
      border-bottom: 1px dashed $base-border-color;
      left: 0;
      top: 7px;
      width: 100%;
    }
  }

  .add-section-form {
    display: block;
    position: relative;

    input {
      padding: 5px 5px 5px 0px;
      width: 100%;
      border: 0;
      outline: none;
      font-size: 1.1em;
      color: $list-primary;

      &::-webkit-input-placeholder { /* Chrome/Opera/Safari */
        color: $list-primary !important;
        font-weight: 300;
      }
      &::-moz-placeholder { /* Firefox 19+ */
        color: $list-primary !important;
        font-weight: 300;
      }
      &:-ms-input-placeholder { /* IE 10+ */
        color: $list-primary !important;
        font-weight: 300;
      }
      &:-moz-placeholder { /* Firefox 18- */
        color: $list-primary !important;
        font-weight: 300;
      }
    }
  }

  .cancel-add-section-icon {
    position: absolute;
    color: darken($base-border-color, 7%);
    cursor: pointer;
    top: 4px;
    right: 0;
    background: rgba(255,255,255,0.5);
    padding: 5px;
    font-size: 0.8em;
  }

  .add-item-lite-ghost {
    margin-bottom: 10px;
    color: $base-border-color;
    cursor: not-allowed;
  }
}
</style>
