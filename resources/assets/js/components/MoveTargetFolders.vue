<template lang="html">
  <div class="move-target-folders">
    <h5>Folders <span v-if="movableFolders&&movableFolders.length">(click to open)</span></h5>

    <!-- <small class="text-muted" v-if="movableFolders&&movableFolders.length"><i class="far fa-fw fa-lightbulb" aria-hidden="true"/> Click to open.</small> -->

    <mover-adder v-if="moverContext=='folder'" model="folder"/>

    <div class="info-message" v-if="showFolderInfoMessage">
      <i class="far fa-spinner fa-spin fa-lg" aria-hidden="true" v-if="moverIsLoading"/>
      <p :class="[folderInfoMessage.type]" v-if="folderInfoMessage.content&&folderInfoMessage.type">{{ folderInfoMessage.content }}</p>
    </div>

    <ul class="list-unstyled" v-if="movableFolders&&movableFolders.length&&!moverIsLoading">
      <li v-if="isStoringMovableFolder">
        <i class="far fa-spinner fa-spin fa-lg" aria-hidden="true"/>
      </li>
      <li class="nested-folder"
          v-for="folder in movableFolders"
          @click.prevent="openMoverFolder(folder)"
          @dblclick.prevent="openMoverFolder(folder)"
          :key="folder.fake_id"
      >
        <span>
          <i class="fas fa-fw fa-folder" aria-hidden="true"/>
          {{ folder.name }}
        </span>
        <i class="far fa-angle-right" aria-hidden="true" @click="openMoverFolder(folder)"/>
      </li>
    </ul>
  </div>

</template>

<script>
import MoverAdder from './MoverAdder.vue'
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'move-target-folders',
  components: {
    MoverAdder,
  },
  data () {
    return {
      newMovableFolder: { name: null },
    }
  },
  computed: {
    ...mapGetters([
      'folderInfoMessage',
      'movableFolders',
      'moverContext',
      'moverIsAddingFolder',
      'moverIsLoading',
      'openMovableFolder',
      'isStoringMovableFolder',
    ]),
    showFolderInfoMessage: function() {
      return this.moverIsLoading || this.folderInfoMessage.content && this.folderInfoMessage.type
    },
  },
  methods: {
    ...mapActions([
      'addToMoverArray',
      'openMoverFolder',
      'setMoverVariable',
      'toggleMoverVariable',
    ]),
  },
}
</script>

<style lang="scss">
.move-target-folders {
  h5 span {
    color: $light-grey-text-color;
    font-weight: 300;
  }
}

.add-folder-button {
  cursor: pointer;
  display: block;
  padding: 5px;
  border-radius: 3px;
  &:hover {
    background: lighten($body-bg, 0.5%);
  }
  .far, .fas, .fal {
    color: $folder-primary;
  }
}

.add-folder-form {
  display: inline-block;
  width: 100%;
  margin: 0;
  margin-left: 10px;

  .add-folder-form-input {
    width: 60%;
    display: inline-block;
  }
  .add-folder-form-buttons {
    width: 38%;
    display: inline-block;
    .fa-check {
      color: white;
    }
  }
}
</style>
