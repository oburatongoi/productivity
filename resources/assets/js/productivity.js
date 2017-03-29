
/**
 * First we will load all of this project's JavaScript dependencies which
 * include Vue and Vue Resource. This gives a great starting point for
 * building robust, powerful web applications using Vue and Laravel.
 */

require('./bootstrap');

/**
 * Next, we will create a fresh Vue application instance and attach it to
 * the page. Then, you may begin adding components to this application
 * or customize the JavaScript scaffolding to fit your unique needs.
 */

Vue.component('Breadcrumbs', require('./components/Breadcrumbs.vue'));
Vue.component('MainMenu', require('./components/MainMenu.vue'));
Vue.component('ActionNav', require('./components/ActionNav.vue'));
Vue.component('Folders', require('./components/Folders.vue'));
Vue.component('Folder', require('./components/Folder.vue'));
Vue.component('Notes', require('./components/Notes.vue'));
Vue.component('Note', require('./components/Note.vue'));
Vue.component('Checklists', require('./components/Checklists.vue'));
Vue.component('Checklist', require('./components/Checklist.vue'));

// v-focus global directive
Vue.directive('focus', {
  // When the bound element is inserted into the DOM...
  inserted: function (el) {
    // Focus the element
    el.focus()
  }
})

import store from './store.js'
import VTooltip from 'v-tooltip'

Vue.use(VTooltip)

var bus = new Vue()

const app = new Vue({
    el: '#productivity-app',
    store,
    bus
});
