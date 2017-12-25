import Vuex from 'vuex'
import Breadcrumbs from '../../components/Breadcrumbs.vue'
import { createLocalVue, shallow } from 'vue-test-utils';
const localVue = createLocalVue()
localVue.use(Vuex)

describe('Breadcrumbs', () => {
  let wrapper
  let getters
  let store

  beforeEach(() => {

    getters = {
      currentFolder: () => {},
      ancestors: () => {},
      checklist: () => {}
    }

    store = new Vuex.Store({
      getters
    })

    wrapper = shallow(Breadcrumbs, {
      localVue,
      store
    })

  });

  // it ('defaults to a hasCurrentView of false', () => {
  //   expect(wrapper.vm.hasCurrentView).toBe(false)
  // });

  // it ('computes currentFolderIsAncestor', () => {
  //   wrapper.setComputed({
  //     currentFolder: {},
  //     ancestors: []
  //   })
  //   expect(wrapper.vm.currentFolderIsAncestor).toBe(false)
  //   wrapper.setComputed({
  //     currentFolder: {id: 11},
  //     ancestors: [
  //       {id: 9},
  //       {id: 10}
  //     ]
  //   })
  //   expect(wrapper.vm.currentFolderIsAncestor).toBe(false)
  //   wrapper.setComputed({
  //     currentFolder: {id: 11},
  //     ancestors: [
  //       {id: 9},
  //       {id: 10},
  //       {id: 11}
  //     ]
  //   })
  //   // console.log(_.findIndex(wrapper.vm.ancestors, ['id', wrapper.vm.currentFolder.id]) !== -1);
  //   expect(wrapper.vm.currentFolderIsAncestor).toBe(true)
  // });


});
