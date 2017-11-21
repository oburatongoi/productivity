<template lang="html">
  <transition name="fade" leave enter>
    <li class="productivity-notice"
      :class="noticeClass"
      @click.self="deleteNotice(notice)"
    >
      <h5 class="heading" v-if="notice.heading">{{notice.heading}}</h5>
      <p class="message" v-if="notice.message">{{notice.message}}</p>
      <div class="inner-html" v-if="notice.rawHTML" v-html="notice.rawHTML"></div>
      <div class="buttons" v-if="notice.buttons&&notice.buttons.length">
        <button v-for="button in notice.buttons"
                class="btn"
                :class="button.class"
                @click="callAction(button.action, notice)"
                :key="getKey()">
          {{button.text}}
        </button>
      </div>
    </li>
  </transition>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'notice',
  props: {
    notice: Object
  },
  methods: {
    ...mapActions([
      'deleteNotice'
    ]),
    callAction: function(fnx, notice = null) {
      if(!fnx) return;
      var arg = notice && typeof notice == 'object' ? JSON.stringify(notice) : notice;
      var fn = arg ? fnx.toString() + '('+arg+')' : fnx.toString();
      return eval(fn);
    },
    getKey: function() {
      return _.uniqueId()
    }
  },
  computed: {
    noticeClass: function() {
      return this.notice.type
    }
  }
}
</script>

<style lang="scss">
  li.productivity-notice {
    z-index: 99999999999999999;
    width: 100%;
    float: right;
    padding: 10px;
    margin-bottom: 10px;
    display: block;
    border-radius: 3px;
    opacity: 0.9;

    &.info {
      background: $list-background;
      color: white;
    } // &.info

    &.success {
      background: $list-background;
      color: white;
    } // &.success

    &.error {
      background: $list-background;
      color: white;
    } // &.error

    .heading,
    .message,
    .inner-html,
    .buttons {
      margin: 0;
      &:not(:last-child) {
        margin-bottom: 3px;
      }
      text-align: center;
    } // .heading,.message,.inner-html,.buttons

    .buttons {
      button {
        &:not(:last-child) {
          margin-right: 5px;
        } //&:not(:last-child)

      } // button

    } // .buttons

    .heading {
      font-weight: bold;
      font-size: 1.1em;
    } // .heading

    a {
      text-decoration: underline;
      text-decoration-style: dotted;
      color: inherit;
      font-weight: bold;

      &:hover {
        text-decoration-style: solid;
      } // hover

    } // a

    .fade-enter-active, .fade-leave-active {
      transition: opacity .8s
    }
    .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
      opacity: 0
    }

  }

</style>
