<template lang="html">
  <div class="mover-breadcrumbs">
    <span class="back-button" @click="goBack" v-if="openMovableFolder.id||openMovableChecklist.id">
      <i class="far fa-fw fa-arrow-left"/>
      <span>{{ backButtonText }}</span>
    </span>

    <span v-if="!openMovableFolder.id&&!openMovableChecklist.id">
      <i class="fas fa-fw fa-home " aria-hidden="true"/>
      Home
      <i class="far fa-angle-down" aria-hidden="true"/>
    </span>

    <span v-if="openMovableFolder.id">
      <span
        class="crumb"
        @click.stop.prevent="selectBreadcrumb(openMovableFolder, 'folder')"
      >
        <i class="fas fa-fw fa-folder-open" aria-hidden="true"/>
        {{ openMovableFolder.name | truncate(45) }}
        <i class="far fa-angle-down" aria-hidden="true" v-if="moverContext=='folder'"/>
      </span>
    </span>

    <span v-if="openMovableChecklist.id">
      <i class="far fa-angle-right" aria-hidden="true"/>
      <span
        class="crumb"
        :class="{ opened: moverContext=='checklist'&&!selectedMovableChecklistItem.id }"
        @click.stop.prevent="selectBreadcrumb(openMovableChecklist, 'checklist')"
      >
        <i class="far fa-fw fa-list-ul" aria-hidden="true"/>
        {{ openMovableChecklist.title | truncate(45) }}
        <i class="far fa-fw fa-angle-down" aria-hidden="true" v-if="moverContext=='checklist'"/>
      </span>
      <i class="far fa-fw fa-angle-right" aria-hidden="true" v-if="moverContext=='checklist-item'&&!openMovableChecklistItem.id"/>
    </span>

    <template v-if="breadcrumbs.length">
      <span
        v-for="item in breadcrumbs"
        :key="item.id"
        @click.stop.prevent="selectBreadcrumb(item)"
      >
        <i class="far fa-angle-right" aria-hidden="true"/>
        <span
          class="crumb"
          :class="{ opened: item.id==selectedMovableChecklistItem.id }"
        >
          <i class="far fa-fw fa-square" aria-hidden="true" v-if="item.id!=openMovableChecklistItemChain[openMovableChecklistItemChain.length-1].id"/>
          <i class="fal fa-fw fa-circle" aria-hidden="true" v-else/>
          {{ item.content | truncate(45) }}
          <i class="far fa-fw fa-angle-down" aria-hidden="true" v-if="item.id==openMovableChecklistItem.id"/>
        </span>
      </span>
    </template>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'mover-breadcrumbs',
  computed: {
    ...mapGetters([
      'currentFolder',
      'moverContext',
      'openMovableFolder',
      'openMovableChecklist',
      'openMovableChecklistItem',
      'openMovableChecklistItemChain',
      'selectedMovableChecklistItem',
    ]),
    backButtonText: function() {
      return this.openMovableChecklist.id || this.openMovableFolder.parent_id ? 'Back' : 'Home'
    },
    breadcrumbs: function() {
      return this.openMovableChecklistItemChain.length ? this.openMovableChecklistItemChain.slice().reverse() : []
    },
  },
  methods: {
    ...mapActions([
      'closeMoverChecklist',
      'closeMoverChecklistItem',
      'removeFromMoverArray',
      'selectAndOpenMoverChecklist',
      'openMoverChecklistItem',
      'openMoverFolder',
    ]),
    goBack: function() {
      if (this.openMovableChecklistItem.id) this.closeMoverChecklistItem()
      else if (this.openMovableChecklist.id) this.closeMoverChecklist()
      else if (this.openMovableFolder.id) this.openMoverFolder(this.openMovableFolder.folder || null)
    },
    selectBreadcrumb: function(breadcrumb, model = 'checklist-item') {
      if( model == 'checklist-item' ) {
        this.removeFromMoverArray({ array: 'openMovableChecklistItemChain', value: breadcrumb, removePrecedingSubItems: true })
        this.openMoverChecklistItem(breadcrumb)
      } else {
        this.removeFromMoverArray({ array: 'openMovableChecklistItemChain', removeAll: true })
        if( model == 'checklist' ) this.selectAndOpenMoverChecklist(breadcrumb)
        else if( model == 'folder' ) this.openMoverFolder(breadcrumb)
      }
    },
  },

}
</script>

<style lang="scss">
.mover-breadcrumbs {
  background: white;
  margin-bottom: 0;
  padding: 10px 10px 5px;
  border-bottom: 1px solid $base-border-color;
  & > span {
    margin-bottom: 5px;
    margin-right: 2px;
    cursor: pointer;
    display: inline-block;

    & > .fa-angle-right {
      margin-right: 5px;
    }
  }

  .back-button {
    display: inline-block;
    padding-right: 10px;
    margin-right: 10px;
    border-right: 1px solid $base-border-color;
    color: darken($base-border-color, 30%);
    &:hover {
      color: $list-primary;
    }
  }

  .crumb {
    display: inline-block;
    padding: 3px;
    border-radius: 3px;
    margin: 0;
    &.opened {
      background: $list-background;
      &, .far, .fas, .fal {
        color: white;
      }
    }
  }



  .fa-angle-down,
  .fa-angle-right {
    color: darken($base-border-color, 10%);
  }
  .fa-angle-right {
    margin-left: 5px;
  }
  .fa-home,
  .fa-folder-open {
    // color: $folder-primary;
    @include base-icon-color ;
  }
  .fa-square,
  .fa-circle {
    // color: $input-border;
    @include base-icon-color ;
  }
  .fa-list-ul,
  .fa-list-ol,
  .fa-list {
    // color: $list-primary;
    @include base-icon-color ;
  }
}
</style>
