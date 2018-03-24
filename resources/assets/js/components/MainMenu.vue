<template lang="html">

  <div class="main-menu">

    <div class="main-logo">
      <!-- <i class="far fa-bars" aria-hidden="true"/> -->
        <!-- <a href="/">
            {{ logo }}
        </a> -->
        <a href="/">
            M
        </a>
    </div>

    <!-- <search/> -->

    <ul class="main-menu-options">

      <li class="menu-option">
          <a href="/">
            <i class="fas fa-fw fa-home " aria-hidden="true"/>
            <p>Home</p>
          </a>
      </li>

      <li class="menu-option">
          <a href="#" @click.prevent="toggleCreatingNewButtons()">
            <i class="fas fa-fw fa-plus-circle" aria-hidden="true"/>
            <p>New</p>
          </a>
      </li>

      <li class="menu-option">
          <a href="#" @click.prevent="toggleSearchability(true)">
            <i class="fas fa-fw fa-search" aria-hidden="true"/>
            <p>Search</p>
          </a>
      </li>

      <li class="menu-option">
        <a href="/folders">
          <i class="fas fa-fw fa-folder" aria-hidden="true"/>
          <p>Folders</p>
        </a>
      </li>

      <li class="menu-option">
        <a href="/lists">
          <i class="fas fa-fw fa-list" aria-hidden="true"/>
          <p>Lists</p>
        </a>
      </li>

      <!-- <li v-if="showNestedOptions" class="nested-menu-options" :class="{open:showNestedOptions}">
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
      </li> -->
    </ul>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'main-menu',
  props: {
    logo: {
      type: String,
      default: 'M'
    }
  },
  computed: {
    ...mapGetters([
      'search'
    ]),
  },
  methods: {
    ...mapActions([
      'clearSearchResults',
      'setSearchability',
      'setSearchErrorMessage',
      'toggleCreatingNewButtons'
    ]),
    cancel: function() {
      this.clearSearchResults()
      this.setSearchErrorMessage()
      this.search.query = undefined
      return this.setSearchability(false)
    },
    toggleSearchability: function() {
      return this.setSearchability(!this.search.isSearchable)
    },
  },
}
</script>

<style lang="scss">
.main-menu {
    // text-align: left;
    text-align: center;
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
        margin-top: 15px;
        a, button {
            color: white;
        }
    }
    li.menu-option {
        // text-align: left;
        text-align: center;
        // border-radius: 18px;
        border-radius: 10%;
        a, button {
            display: block;
            // width: 100%;
            padding: 3px;
            text-shadow: $folder-text-shadow;
            text-decoration: none;
            // font-size: 1.5em;
            font-size: 1.4em;
        }
        p {
          font-size: 0.6em;
          opacity: 0;
          padding: 0;
          margin: 0;
          margin-top: -5px;
        }
        &:hover p {
          opacity: 1;
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
    font-size: 1em;
    color: rgba(255,255,255,0.7);
    cursor: pointer;
    text-shadow: $folder-text-shadow;
    &:hover {
        color: rgba(255,255,255,1);
    }
    &, & li {
      display: block;
      margin:0;
      padding: 0;
      text-align: center;
      width: 100%;
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
