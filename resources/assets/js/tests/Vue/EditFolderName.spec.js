import Vuex from 'vuex'
import Folder from '../../components/EditFolderName.vue'
import { createLocalVue, shallow } from 'vue-test-utils';
const localVue = createLocalVue()
localVue.use(Vuex)

describe('EditFolderName', () => {
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

});
