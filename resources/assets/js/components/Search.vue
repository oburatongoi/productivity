<template lang="html">
  <div class="search-wrapper">
    <form class="search-form" :class="searchFormClass" autocomplete="off">
      <i class="far fa-search" aria-hidden="true"/>
      <search-input/>
      <i class="far fa-times cancel-search-btn" aria-hidden="true" v-if="search.query" @click="cancel"/>
    </form>
  </div>

</template>

<script>
import { mapActions, mapGetters } from 'vuex'

import SearchInput from './SearchInput.vue'

export default {
  name: 'search',
  components: {
    SearchInput
  },
  computed: {
    ...mapGetters([
      'search'
    ]),
    searchFormClass: function() {
      return this.search.query ? 'has-query' : null
    }
  },
  methods: {
    ...mapActions([
      'clearSearchResults',
      'setIsSearching',
      'setSearchErrorMessage'
    ]),
    cancel: function() {
      this.clearSearchResults()
      this.setSearchErrorMessage()
      this.search.query = undefined
      return this.setIsSearching(false)
    }
  },
}
</script>

<style lang="scss">
.search-wrapper {
    position: relative;
    padding: 10px 0;
    width: 100%;

    @media(max-width:767px){
        width: 100%;
        height: 35px;
    }
}


.search-form {
    .far, .fas, .fal {
        color: white;
    }
    display: block;
    width: 100%;
    background: rgba(255,255,255,0.2);
    padding: 6px 8px;
    border-radius: 18px;
    border: 1px solid rgba(255,255,255,0);
    font-weight: $font-weight-light;
    @include base-box-shadow;

    &.has-query {
        border: 1px solid rgba(255,255,255,0.2);
    }

    .search-input {
        background: rgba(255,255,255,0.2);
        &,
        &:active {
            display: inline-block;
            outline: none;
            border: 0;
            box-shadow: none;
            font-size: 0.9em;
            height: 100%;
            background: transparent;
            color: white;
            width: 85%;
            @media(min-width:769px) and (max-width:840px) {
                width: 80%;
            }
        }
    }
    .cancel-search-btn {
        cursor: pointer;
        font-size: 0.8em;
        margin-top: 6px;
        float: right;
    }

    ::-webkit-input-placeholder { /* Chrome */
      color: white;
    }
    :-ms-input-placeholder { /* IE 10+ */
      color: white;
    }
    ::-moz-placeholder { /* Firefox 19+ */
      color: white;
      opacity: 1;
    }
    :-moz-placeholder { /* Firefox 4 - 18 */
      color: white;
      opacity: 1;
    }
}



.folder-color-scheme mark {
    background: #E5F5FF;
}

.list-color-scheme mark {
    background: #DEF2E3;
}
.secondary-search-input {
    width: 100%;
    line-height: 40px;
    border: 1px solid $base-border-color;
    border-radius: 25px;
    margin-top: 10px;
    margin-bottom: 20px;
    padding: 0 10px 0 10px;

    input {
        outline: none;
        border: 0;
        height: 40px;
        padding: 5px 10px;
        width: 90%;
        display: inline-block;
    }

    .far, .fas, .fal {
        font-size: 1.2em;
        color: darken($base-border-color, 10%);
    }

    .fa-times {
        float: right;
        margin-top: 12px;
        cursor: pointer;
    }
}

</style>
