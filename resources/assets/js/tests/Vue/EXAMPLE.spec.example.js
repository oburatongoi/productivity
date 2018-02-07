import Vuex from 'vuex'
import Example from '../../components/Example.vue'
import { createLocalVue, shallow } from '@vue/test-utils';
const localVue = createLocalVue()
localVue.use(Vuex)

describe('Example', () => {
  let wrapper
  let state
  let actions
  let getters
  let store

  let folderNav
  let selectFiles
  let selectTasks

  beforeEach(() => {
    state = {

    }

    actions = {
      clearSelected: sinon.spy()
    }

    getters = {
      selectedIsMovable: () => true
    }

    store = new Vuex.Store({
      state,
      actions,
      getters
    })

    wrapper = shallow(Example, {
      localVue,
      store
    })

    folderNav = wrapper.find('#folder-nav')
    selectFiles = wrapper.find('li#select-files')
    selectTasks = wrapper.find('li#select-tasks')

  });

  it ('defaults to a view of files', () => {
    expect(wrapper.vm.view).toBe('files')
  });

  it ('changes view when folder nav option is clicked', () => {
    expect(wrapper.vm.view).toBe('files');
    expect(selectFiles.html()).toContain('selected');
    expect(selectTasks.html()).not.toContain('selected');

    selectTasks.trigger('click');
      expect(actions.clearSelected.called).toBe(true);

      expect(wrapper.vm.view).toBe('tasks')
      expect(selectTasks.html()).toContain('selected');
      expect(selectFiles.html()).not.toContain('selected');

    selectFiles.trigger('click');
      expect(wrapper.vm.view).toBe('files')
      expect(selectFiles.html()).toContain('selected');
      expect(selectTasks.html()).not.toContain('selected');
  });

  it ('contains a folder nav', () => {
    expect(folderNav.html()).toContain('li');
    expect(selectFiles).toBeTruthy();
    expect(selectTasks).toBeTruthy();
  });

});
