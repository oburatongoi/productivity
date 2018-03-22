<template lang="html">

  <div class="main-menu">

    <div class="main-logo">
      <!-- <i class="far fa-bars" aria-hidden="true"/> -->
        <a href="/">
            {{ logo }}
        </a>
    </div>

    <search/>

    <ul class="main-menu-options">

      <li class="menu-option">
          <a href="/">
            <i class="fas fa-fw fa-home " aria-hidden="true"/>
            Home
          </a>
      </li>

      <li class="menu-option">
        <button type="button" @click="toggleNestedOptions">
          <i class="far fa-fw fa-inbox" aria-hidden="true"/>
          Browse
          <i class="fa" :class="showNestedOptionsClass" aria-hidden="true"/>
        </button>
      </li>

      <li v-if="showNestedOptions" class="nested-menu-options" :class="{open:showNestedOptions}">
        <ul>
          <li>
            <a href="/folders">
              <i class="fas fa-fw fa-folder" aria-hidden="true"/>
              Folders
            </a>
          </li>

          <li>
            <a href="/lists">
              <i class="far fa-fw fa-list" aria-hidden="true"/>
              Lists
            </a>
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import Search from './Search.vue'

export default {
  name: 'main-menu',
  components: {
    Search
  },
  props: {
    logo: {
      type: String,
      default: 'Productivity'
    }
  },
  data () {
    return {
      showNestedOptions: false
    }
  },
  computed: {
    ...mapGetters([
      'showCreatingNewButtons',
      'selected'
    ]),
    showNestedOptionsClass: function() {
      return this.showNestedOptions ? 'fa-caret-up' : 'fa-caret-down'
    }
  },
  methods: {
    ...mapActions([
      'toggleCreatingNewButtons'
    ]),
    toggleNestedOptions: function() {
      this.showNestedOptions = ! this.showNestedOptions
    }
  },
}
</script>

<style lang="scss">
.main-menu {
    text-align: left;
    @media(max-width:767px){
        padding: 0 5px;
    }
    @media(min-width:768px){
        padding: 0 10px;
    }
    ul {
        list-style: none;

        &,
        & li {
            padding: 0;
            margin: 0;
            width: 100%;
            display: block;
        }
    }

    ul.main-menu-options {
        margin-top: 5px;
        a, button {
            color: white;
        }
    }
    li.menu-option {
        text-align: left;
        border-radius: 18px;
        a, button {
            display: block;
            width: 100%;
            padding: 8px;
            text-shadow: $folder-text-shadow;
            text-decoration: none;
        }
        button {
            background: transparent;
            outline: none;
            border: 0;
            text-align: left;
        }
        &.open,
        &:hover {
            background: rgba(255,255,255,0.2);
        }
    }

    .nested-menu-options {
        padding-left: 20px;
        a {
            display: block;
            padding: 5px 8px ;
            border-radius: 18px;
            &:hover {
                background: rgba(255,255,255,0.2);
            }
        }
    }

}

.auth-links {
    position: absolute;
    bottom: 3vh;
    color: white;
    list-style: none;
    margin: 0;
    font-size: 0.9em;
    color: rgba(255,255,255,0.7);
    cursor: pointer;
    text-shadow: $folder-text-shadow;
    &:hover {
        color: rgba(255,255,255,1);
    }
}

.main-logo {
    text-align: center;
    a {
        font-size: 2em;
        font-family: $logo-font;
        text-shadow: 0px 1px 1px rgba(0,114,255,1);
        line-height: 40px;
        color: white;
        text-decoration: none;
        &:hover {
          color: white;
          text-decoration: none;
            text-shadow: 0px 0px 1px rgba(0,114,255,1);
        }
    }
}

</style>
