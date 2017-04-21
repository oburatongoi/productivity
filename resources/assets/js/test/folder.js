import Vue from 'vue/dist/vue.js';
import test from 'ava';
import Folder from '../components/Folder'

let vm;

test.beforeEach(t => {
    let F = Vue.extend(Folder);

    vm = new N({ propsData: {

    }}).$mount();
});

test('that it renders folders', t => {
    t.pass();
});
