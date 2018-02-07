import Vuex from 'vuex'
import Folder from '../../components/Folder.vue'
import { createLocalVue, shallow } from '@vue/test-utils';
const localVue = createLocalVue()
localVue.use(Vuex)

describe('Folder', () => {
  let wrapper
  let actions
  let getters
  let store

  let currentFolder = {
    name: 'Test',
    fake_id: 12345,
  }

  beforeEach(() => {
    actions = {
      clearSelected: sinon.spy()
    }

    getters = {
      selectedIsMovable: () => true,
    }

    store = new Vuex.Store({
      actions,
      getters
    })

    wrapper = shallow(Folder, {
      store,
      localVue,
    })

  });

  it ('defaults to a view of files', () => {
    expect(wrapper.vm.view).toBe('files')
  });

  it ('changes view when folder nav option is clicked', () => {
    let selectFiles = wrapper.find('li#select-files')
    let selectTasks = wrapper.find('li#select-tasks')

    expect(wrapper.vm.view).toBe('files')
    expect(selectFiles.html()).toContain('selected')
    expect(selectTasks.html()).not.toContain('selected')

    selectTasks.trigger('click')
      expect(actions.clearSelected.called).toBe(true)

      expect(wrapper.vm.view).toBe('tasks')
      expect(selectTasks.html()).toContain('selected')
      expect(selectFiles.html()).not.toContain('selected')

    selectFiles.trigger('click');
      expect(wrapper.vm.view).toBe('files')
      expect(selectFiles.html()).toContain('selected')
      expect(selectTasks.html()).not.toContain('selected')
  });

  it ('contains a folder nav', () => {
    let folderNav = wrapper.find('#folder-nav')
    let selectFiles = wrapper.find('li#select-files')
    let selectTasks = wrapper.find('li#select-tasks')

    expect(folderNav.html()).toContain('li')
    expect(selectFiles).toBeTruthy()
    expect(selectTasks).toBeTruthy()
  });

});
