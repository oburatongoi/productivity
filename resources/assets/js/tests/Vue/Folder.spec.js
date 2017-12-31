import Vuex from 'vuex'
import Folder from '../../components/Folder.vue'
import { createLocalVue, shallow } from 'vue-test-utils';
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
      clearSelected: sinon.spy(),
      saveFolder: sinon.spy(),
      toggleEditability: sinon.spy()
    }

    getters = {
      selectedIsMovable: () => true,
      isEditable: () => false,
      currentFolder: () => currentFolder,
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

  it ('calls toggleEditability when folder name is clicked', () => {
    let folderName = wrapper.find('#folder-name')

    folderName.trigger('click')
      expect(actions.toggleEditability.called).toBe(true)
  });

  it ('calls toggleEditability when input blur event is fired', () => {
    let input = wrapper.find('#folder-name-input')
    input.trigger('blur')
    expect(actions.toggleEditability.called).toBe(true)
  });

  it ('calls debounceSaveChanges when input keyup event is fired', () => {
    wrapper.setMethods({
      debounceSaveChanges: sinon.spy(),
      saveChanges: sinon.spy()
    })
    let input = wrapper.find('#folder-name-input')
    input.trigger('keyup')
    expect(wrapper.vm.debounceSaveChanges.called).toBe(true)
  });

  it ('calls debounceSaveChanges when input keydown event is fired', () => {
    wrapper.setMethods({
      debounceSaveChanges: sinon.spy(),
      saveChanges: sinon.spy()
    })
    let input = wrapper.find('#folder-name-input')
    input.trigger('keydown')
    expect(wrapper.vm.debounceSaveChanges.called).toBe(true)
  });

  it ('calls debounceSaveChanges when input cut event is fired', () => {
    wrapper.setMethods({
      debounceSaveChanges: sinon.spy(),
      saveChanges: sinon.spy()
    })
    let input = wrapper.find('#folder-name-input')
    input.trigger('cut')
    expect(wrapper.vm.debounceSaveChanges.called).toBe(true)
  });

  it ('calls debounceSaveChanges when input paste event is fired', () => {
    wrapper.setMethods({
      debounceSaveChanges: sinon.spy(),
      saveChanges: sinon.spy()
    })
    let input = wrapper.find('#folder-name-input')
    input.trigger('paste')
    expect(wrapper.vm.debounceSaveChanges.called).toBe(true)
  });

  it ('calls saveChanges when debounceSaveChanges is called', () => {
    wrapper.setMethods({ saveChanges: sinon.spy() })
    let clock = sinon.useFakeTimers()
    wrapper.vm.debounceSaveChanges()
    clock.tick(1000)
    expect(wrapper.vm.saveChanges.called).toBe(true)
    clock.restore();
  });

  it ('calls saveFolder when saveChanges is called', () => {
    wrapper.vm.saveChanges()
    expect(actions.saveFolder.called).toBe(true)
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
